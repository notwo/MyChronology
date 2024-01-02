package main

import "github.com/gin-gonic/gin"

import "net/http"

func main() {
    engine:= gin.Default()
    engine.LoadHTMLGlob("templates/*")
    engine.GET("/", func(c *gin.Context) {
        c.HTML(http.StatusOK, "index.html", gin.H{
        })
    })
    engine.Run(":3000")
}
