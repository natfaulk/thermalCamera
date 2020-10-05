#include "utils.hpp"

String Utils_GetDeviceID(void)
{
  String out = "";

  uint8_t* uidPtr = (uint8_t *)0x1FFFF7E8;

  for (uint32_t i = 0; i < 12; ++i)
  {
    char s[10];
    sprintf(s, "%02X", *(uidPtr + i));
    out += s;
  }

  return out;
}
