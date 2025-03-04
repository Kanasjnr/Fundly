import { Card, CardContent } from "../../components/ui/card"
import { DollarSign, Users, Briefcase } from "lucide-react"

const stats = [
  { icon: <DollarSign className="h-12 w-12 text-fundly-600" />, value: "$10M+", label: "Funds Raised" },
  { icon: <Users className="h-12 w-12 text-fundly-600" />, value: "50,000+", label: "Backers" },
  { icon: <Briefcase className="h-12 w-12 text-fundly-600" />, value: "1,000+", label: "Successful Projects" },
]

const Stats = () => {
  return (
    <section className="py-20 px-6 md:px-12 bg-fundly-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-fundly-800">Fundly in Numbers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 flex flex-col items-center text-center">
                {stat.icon}
                <h3 className="text-4xl font-bold my-4 text-fundly-700">{stat.value}</h3>
                <p className="text-xl text-gray-600">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Stats
