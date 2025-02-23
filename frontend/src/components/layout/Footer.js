import React from 'react'
import { whitelist } from 'validator'

const Footer = () => {
  return (
    <footer class="bg-dark text-white mt-5 p-4 text-center">
      Copyright &copy; { new Date().getFullYear()} Simple Social App
  </footer>
  )
}

export default Footer
