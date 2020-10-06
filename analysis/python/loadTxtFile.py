import os
import json
import pandas as pd

BASE_PATH = os.path.dirname(os.path.realpath(__file__))
DATA_FOLDER = 'data'
DATA_LINE_HEADER = '[data] '

def loadFile(filename):
  FILENAME = os.path.join(BASE_PATH, '..', DATA_FOLDER, filename)
  inputFile = open(FILENAME, 'r') 
  lines = inputFile.readlines() 

  data = []
  for l in lines:
    l_decoded = decodeLine(l)
    if l_decoded:
      data.append(l_decoded)

  df = pd.DataFrame(data)
  df['time'] = pd.to_datetime(df['time'], unit='ms')

  return df


def decodeLine(line):
  temp = line.split('|')
  if len(temp) < 3:
    return None

  if not temp[2].startswith(DATA_LINE_HEADER):
    return None
  
  parsedLine = json.loads(temp[2][len(DATA_LINE_HEADER):])
  parsedLine['time'] = int(temp[1])

  for i in range(len(parsedLine['data'])):
    parsedLine[f'p{i}'] = parsedLine['data'][i]

  del parsedLine['data']
  del parsedLine['ID']
  return parsedLine
