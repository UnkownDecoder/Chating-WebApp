import React from 'react'

const header = () => {
  return (
    <nav className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-4 shadow-2xl">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-4xl font-extrabold tracking-wide glow-effect transition transform hover:scale-105">
          Chatting-WebApp
        </h1>
        <ul className="flex space-x-8">
          <li>
            <a href="#" className="text-lg font-medium hover:text-accent transition duration-300 transform hover:scale-110">
              Home
            </a>
          </li>
          <li>
            <a href="#" className="text-lg font-medium hover:text-accent transition duration-300 transform hover:scale-110">
              About
            </a>
          </li>
          <li>
            <a href="#" className="text-lg font-medium hover:text-accent transition duration-300 transform hover:scale-110">
              Features
            </a>
          </li>
          <li>
            <a href="#" className="text-lg font-medium hover:text-accent transition duration-300 transform hover:scale-110">
              Login
            </a>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default header