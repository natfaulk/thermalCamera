#ifndef CONSTANTS_HPP
#define CONSTANTS_HPP

#include <stdint.h>

static const char*     WIFI_SSID                          = "VlpNetwork";
static const char*     WIFI_PWD                           = "hiddenpassword";
static const uint32_t  WIFI_CONNECT_TIMEOUT_MS            = 30 * 1000; // 30s

static const char*     ENDPOINT_HOST                      = "192.168.88.18";
static const uint16_t  ENDPOINT_PORT                      = 3001;
static const char*     ENDPOINT_URI                       = "/update";

static const uint32_t  SAMPLE_TIME_MS                     = 100;

#endif
