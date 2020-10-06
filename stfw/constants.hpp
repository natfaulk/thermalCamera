#ifndef CONSTANTS_HPP
#define CONSTANTS_HPP

static const char*    VERSION                                = "1.1.0";
static const bool     START_BY_DEFAULT                       = false;

/* Changelog
 *
 * v1.1.0
 *  - Get thermistor temperature from grideye
 * 
 * v1.0.0
 *  - Initial release. Data sent over serial as JSON
 *  - Can control with the following serial commands:
 *      - r : reset
 *      - u : get UID
 *      - i : get board type string (thermo board)
 *      - v : get FW version
 *      - s : start running
 *      - e : end running
 * 
 */

#endif
