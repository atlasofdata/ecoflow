library(ggplot2)
library(xlsx)

setwd("C:/Users/titou/Desktop/Stage/Feedback loop")

data = read.xlsx("trends.xlsx", sheetName = "Sheet1")
year = data[,1]

headings = c("Accuracy 3 days North","Accuracy 3 days South","Accuracy 5 days North", "Accuracy 5 days South","Accuracy 7 days North", "Accuracy 7 days South", "Moore's Law", "WMO Members", "NOAA Weather Stations")
y_labels = c("(%)","Transistors (10e6)")


par(pch = 26, col = "black") # plotting symbol and color
par(mfrow=c(5,2)) # all plots on one page 
par(mar = c(0,1,1.5,1))
par(pin = c(1.4,0.7))
par(mgp = c(1.8,0.6,0))
par(tck = -0.07)
for (i in 2:10){
  heading = headings[i-1]
  if (i %in% c(2,3)){
    plot(year,data[,i], main = heading, xlab = "", ylim = c(70,100), ylab = y_labels[1])
    lines(year, data[,i], type = "l", col = "red")
  }
  if (i %in% c(4,5)){
    plot(year,data[,i], main = heading, xlab = "", ylim = c(50,100), ylab = y_labels[1])
    lines(year, data[,i], type = "l", col = "red")
  }
  if (i %in% c(6,7)){
    plot(year,data[,i], main = heading, xlab = "", ylim = c(30,80), ylab = y_labels[1])
    lines(year, data[,i], type = "l", col = "red")
  }
  if (i == 8){
    plot(year,data[,i], main = heading, xlab = "", ylim = c(0,2700), ylab = y_labels[2])
    lines(year, data[,i], type = "l", col = "red")
  }
  if (i==9){
    plot(year,data[,i], main = heading, xlab = "", ylim = c(0,150), ylab = "")
    lines(year, data[,i], type = "l", col = "red")
  }
  if (i==10){
    plot(year,data[,i], main = heading, xlab = "", ylim = c(22000,45000), ylab = "")
    lines(year, data[,i], type = "l", col = "red")
  }
}

data[,8]
