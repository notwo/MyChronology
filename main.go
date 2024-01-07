package main

import(
  "github.com/gin-gonic/gin"
  "net/http"
)

func main() {
  engine := gin.Default()
  engine.Static("/css", "./static/css")
  engine.Static("/js", "./static/js")
  engine.LoadHTMLGlob("templates/*.html")
  engine.GET("/", func(ctx *gin.Context) {
    ctx.HTML(http.StatusOK, "index.html", gin.H{})
  })
  engine.Run(":3000")
}
