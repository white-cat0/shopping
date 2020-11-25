//这个是vue读取的配置文件，里面的配置最终都是给webpack写的配置，但是我们现在采用的是3.0+的脚手架，讲就是零配置，所以看不见webpack的配置文件 webpack.js
//这里写的代码，因为是给webpack使用，所以需要采用commonjs的规范(本质上就是使用require和 module.exports这两个命令而已)
//但是以后我们在项目里面，也就是src文件夹，还是使用ES6规范(本质上就是import 和 export这两个单词的使用)
//下面的配置可以不用写

module.exports = {
    devServer: {
        open: true, //这个是设置运行 npm run serve 指令之后直接打开浏览器
    }
}