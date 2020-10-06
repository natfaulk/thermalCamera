#include "debug.hpp"

#include <Wire.h>
#include <Adafruit_AMG88xx.h>

#include "utils.hpp"
#include "constants.hpp"

Adafruit_AMG88xx amg;
float pixels[AMG88xx_PIXEL_ARRAY_SIZE];
uint32_t timer = 0;

static const uint32_t  SAMPLE_TIME_MS                     = 100;

String UID = "";
bool running = START_BY_DEFAULT;

void setup(void)
{
  DBG_Setup(115200);
  DBG_s("YEET");

  Wire.begin();

  bool status = amg.begin();
  if (!status) {
    DBG_s("Could not find a valid AMG88xx sensor, check wiring!");
    while (1);
  }
  
  UID = Utils_GetDeviceID();
  DBG_pair("Device UID", UID);
}

void loop(void)
{
  if (running && millis() - timer > SAMPLE_TIME_MS)
  {
    timer = millis();
    amg.readPixels(pixels);
    float thermistor = amg.readThermistor();

    String out = "[data] {\"data\":[";
    for (uint16_t i = 0; i < AMG88xx_PIXEL_ARRAY_SIZE; i++)
    {
      out += String(pixels[i]);
      if (i < AMG88xx_PIXEL_ARRAY_SIZE - 1) out += ',';
    }
    out += "],\"ID\":\"";
    out += UID;
    out += "\",\"thermistor\":";
    out += thermistor;
    out += "}";

    Serial.println(out);
  }

  if (Serial.available() > 0) 
  {
    char c = Serial.read();

    if (c == 'r') NVIC_SystemReset();
    if (c == 'u') DBG_s(UID.c_str());
    if (c == 'i') DBG_s("Thermo board");
    if (c == 'v') DBG_s(VERSION);
    if (c == 's') running = true;
    if (c == 'e') running = false;
  }
}
