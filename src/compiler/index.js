/* @flow */

import { parse } from './parser/index'
import { optimize } from './optimizer'
import { generate } from './codegen/index'
import { createCompilerCreator } from './create-compiler'

// `createCompilerCreator` allows creating compilers that use alternative
// parser/optimizer/codegen, e.g the SSR optimizing compiler.
// Here we just export a default compiler using the default parts.
//這裡只是一個包裝，核心的是baseCompile，因為其使用了parse,optimize,generate去做真正的事情
export const createCompiler = createCompilerCreator(function baseCompile (
  template: string,
  options: CompilerOptions
): CompiledResult {
  //先轉換成AST, AST是一棵抽象的語法樹，在解析之前，template只是一串字符串，在解析之後，我們明白模板的意義并把它轉換成一棵樹給後續使用
  const ast = parse(template.trim(), options) 
  //打印ast樹
  console.log(ast)
  if (options.optimize !== false) {
    optimize(ast, options) //再進行optimze
  }
  const code = generate(ast, options)
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
})
