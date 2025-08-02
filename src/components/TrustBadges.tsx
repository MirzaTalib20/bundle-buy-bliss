import { Shield, Award, Users, Star } from 'lucide-react';

const TrustBadges = () => {
  const badges = [
    { icon: Shield, text: 'Secure Payment', subtext: '256-bit SSL encryption' },
    { icon: Award, text: 'Money Back Guarantee', subtext: '7-day refund policy' },
    { icon: Users, text: '3,000+ Happy Customers', subtext: 'Trusted worldwide' },
    { icon: Star, text: '4.7/5 Rating', subtext: 'Based on 2,500+ reviews' }
  ];

  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {badges.map((badge, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-3">
                <badge.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-sm">{badge.text}</h3>
              <p className="text-xs text-gray-600">{badge.subtext}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;