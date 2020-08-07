#include "debug.hpp"

static bool _nl = true;

bool* _getNl(void)
{
  return &_nl;
}

void DBG_Setup(uint32_t baudrate)
{
#if NATFAULK_DEBUG_ENABLE
  Serial.begin(baudrate);
  Serial.flush();
  Serial.println();
#endif
}

void DBG_s(const char *s, bool newline)
{
#if NATFAULK_DEBUG_ENABLE  
  if (_nl) Serial.print("[INFO] ");
  Serial.print(s);
  if (newline) DBG_nl();
  else _nl = false;
#endif
}

void DBG_f(double n, bool newline)
{
#if NATFAULK_DEBUG_ENABLE  
  if (_nl) Serial.print("[INFO] ");
  Serial.print(n);
  if (newline) DBG_nl();
  else _nl = false;
#endif
}

void DBG_u(uint32_t n, bool newline)
{
#if NATFAULK_DEBUG_ENABLE  
  if (_nl) Serial.print("[INFO] ");
  Serial.print(n);
  if (newline) DBG_nl();
  else _nl = false;
#endif
}

void DBG_nl(void)
{
#if NATFAULK_DEBUG_ENABLE
  _nl = true;
  Serial.println();
#endif
}

