export default function checkKeyHasVal(_obj, _key) {
  return (
    _key in _obj 
    && _obj[_key] !== null
    && _obj[_key] !== undefined
  )
}
