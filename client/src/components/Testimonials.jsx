import React from "react"
import { Card, CardContent } from "../components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
const testimonials = [
    {
      name: "John Doe",
      role: "Entrepreneur",
      quote:
        "Fundly made it incredibly easy to launch my startup. The blockchain integration gave my backers confidence in the transparency of the funding process.",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      name: "Jane Smith",
      role: "Artist",
      quote:
        "As an independent artist, Fundly has been a game-changer. The ability to offer token-gated perks to my supporters has created a whole new level of engagement.",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      name: "Mike Johnson",
      role: "Non-profit Organizer",
      quote:
        "The transparency and security offered by Fundly's blockchain technology have significantly increased donor trust in our campaigns. It's revolutionized our fundraising efforts.",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]
  
  const Testimonials = () => {
    return (
      <section id="testimonials" className="py-20 px-6 md:px-12 bg-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-fundly-800">What Our Users Say</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <p className="text-lg italic mb-6">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold text-fundly-700">{testimonial.name}</h3>
                    <p className="text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    )
  }
  
  export default Testimonials

