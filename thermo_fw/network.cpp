#include "network.hpp"
#include "constants.hpp"
#include "debug.hpp"

#include <WiFi.h>
#include <Arduino.h>
#include <HTTPClient.h>

void NET_Init(void)
{
  DBG_pair("Connecting to", WIFI_SSID);
  WiFi.begin(WIFI_SSID, WIFI_PWD);

  uint32_t start = millis();
  while (1)
  {
    if (millis() - start > WIFI_CONNECT_TIMEOUT_MS)
    {
      DBG_nl();
      DBG_s("WiFi connect timed out");
      break;
    }

    if (WiFi.status() == WL_CONNECTED)
    {
      DBG_nl();
      DBG_s("WiFi connection successful");
      DBG_pair("IP Address is", WiFi.localIP());
      break;
    }

    DBG_s(".", false);
    delay(100);
  }
}

bool NET_SendData(const float* _data, uint16_t _len)
{
  bool returnVal = false;
  HTTPClient http;
  http.begin(ENDPOINT_HOST, ENDPOINT_PORT, ENDPOINT_URI);
  http.addHeader("Content-Type", "application/json");

  String out = "{\"data\":[";
  for (uint16_t i = 0; i < _len; i++)
  {
    out += String(*(_data + i));
    if (i < _len - 1) out += ',';
  }
  out += "]}";

  int httpCode = http.POST(out);
  if(httpCode > 0) {
    if(httpCode == HTTP_CODE_OK) {
      String payload = http.getString();
      if (payload == "ack") returnVal = true;
    } else {
      DBG_pair("HTTP code", httpCode);
    }
  } else {
    DBG_pair("HTTP code", httpCode);
  }
  http.end();
  return returnVal;
}

