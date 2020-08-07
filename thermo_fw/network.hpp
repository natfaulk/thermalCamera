#ifndef NETWORK_HPP
#define NETWORK_HPP

#include <stdint.h>

void NET_Init(void);
bool NET_SendData(const float* _data, uint16_t _len);

#endif
