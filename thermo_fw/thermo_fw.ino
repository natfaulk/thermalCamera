#include "debug.hpp"
#include "network.hpp"
#include "constants.hpp"

#include <Wire.h>
#include <Adafruit_AMG88xx.h>

Adafruit_AMG88xx amg;
float pixels[AMG88xx_PIXEL_ARRAY_SIZE];
uint32_t timer = 0;

void setup(void)
{
  DBG_Setup(115200);
  DBG_s("Hello world");

  NET_Init();

  Wire.begin();

  bool status = amg.begin();
  if (!status) {
    DBG_s("Could not find a valid AMG88xx sensor, check wiring!");
    while (1);
  }
}

void loop(void)
{
  if (millis() - timer > SAMPLE_TIME_MS)
  {
    timer = millis();
    amg.readPixels(pixels);

    String out = "[data] {\"data\":[";
    for (uint16_t i = 0; i < AMG88xx_PIXEL_ARRAY_SIZE; i++)
    {
      out += String(pixels[i]);
      if (i < AMG88xx_PIXEL_ARRAY_SIZE - 1) out += ',';
    }
    out += "]}";

    Serial.println(out);

    // if (NET_SendData(pixels, AMG88xx_PIXEL_ARRAY_SIZE)) DBG_s("Data sent");
    // else DBG_s("Data failed to send");
  }
}
