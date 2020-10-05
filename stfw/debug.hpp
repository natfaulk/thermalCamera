#ifndef DEBUG_HPP
#define DEBUG_HPP

#include <Arduino.h>

#define NATFAULK_DEBUG_ENABLE 1

void DBG_Setup(uint32_t baudrate);
void DBG_s(const char *s, bool = true);
void DBG_f(double n, bool = true);
void DBG_u(uint32_t n, bool = true);
void DBG_nl(void);

// required for the template which has to be in header file
bool* _getNl(void);

template <typename T>
void DBG_pair(const char *s, T n)
{
#if NATFAULK_DEBUG_ENABLE
  if ((* _getNl())) Serial.print("[INFO] ");
  Serial.print(s);
  Serial.print(": ");
  Serial.println(n);
  (* _getNl()) = true;
#endif
}

#endif
