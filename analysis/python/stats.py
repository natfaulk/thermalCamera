
import matplotlib.pyplot as plt
import loadTxtFile

FILENAME1 = 'sav_1.txt'
FILENAME2 = 'sav_6.txt'

df1 = loadTxtFile.loadFile(FILENAME1)
df2 = loadTxtFile.loadFile(FILENAME2)

mask = df1.columns.str.contains('p\d+')
df1['avg'] = df1.loc[:,mask].mean(axis=1)
df2['avg'] = df2.loc[:,mask].mean(axis=1)
print(df1.tail())
print(df2.tail())

print(df1['p1'].std())
print(df2['p1'].std())

# .rolling(window=10).mean()
df1['thermistor'].plot()
df1['p15'].plot()
df2['thermistor'].plot()
df2['p0'].plot()
df2['p5'].plot()
df2['p48'].plot()
df2['p63'].plot()


plt.show()
