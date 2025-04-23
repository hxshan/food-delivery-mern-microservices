import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-[#EB4C40] text-white mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">
                Thank you for letting us deliver your favorites.
              </h3>
              <p>We're proud to bring food faster to your doorstep.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">About Us</h3>
              <ul>
                <li className="mb-2">
                  <a href="#" className="hover:underline">
                    About Company
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="hover:underline">
                    Restaurant Signup
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Get Help</h3>
              <ul>
                <li className="mb-2">
                  <a href="#" className="hover:underline">
                    FAQ
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="hover:underline">
                    Terms and Conditions
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="hover:underline">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contact Us</h3>
              <ul>
                <li className="mb-2">
                  <a href="#" className="hover:underline">
                    Email
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="hover:underline">
                    Phone
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 text-center text-sm">
            <p>© 2025 Name. All rights reserved.</p>
          </div>
        </div>
      </footer>
  )
}

export default Footer