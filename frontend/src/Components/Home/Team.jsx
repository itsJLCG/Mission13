import React from 'react'
import member1 from '../../assets/city.png'
import member2 from '../../assets/city.png'
import member3 from '../../assets/city.png'
import member4 from '../../assets/city.png'

const team = [
  {
    name: 'Indio Lempira',
    role: 'Senior Developer',
    img: member1,
  },
  {
    name: 'Florinda Meza',
    role: 'Graphic Designer',
    img: member2,
  },
  {
    name: 'Chico Morazan',
    role: 'Community Manager',
    img: member3,
  },
  {
    name: 'Calamaro Ruiz',
    role: 'Community Manager',
    img: member4,
  },
]

const Team = () => {
  return (
    <section className="mt-44">
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Lexend+Deca:wght@700&family=Nunito+Sans:wght@400;700&display=swap"
        rel="stylesheet"
      />
      <div className="max-w-6xl mx-auto px-30">
        <h2
          className="text-4xl font-extrabold text-center mb-10 uppercase tracking-wide"
          style={{ fontFamily: 'Lexend Deca, sans-serif', color: '#020202', letterSpacing: '0.1em' }}
        >
          Our Team
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
          {team.map((member, idx) => (
            <div key={member.name} className="flex flex-col items-center text-center">
              <div
                className="w-40 h-40 rounded-full overflow-hidden border-4 mb-4 shadow-xl bg-[#f1f3f0] flex items-center justify-center team-photo-animate"
                style={{
                  borderColor: '#b8f772',
                  boxShadow: '0 8px 32px 0 rgba(34, 197, 94, 0.10)',
                  animation: `teamBounce 1.2s ${idx * 0.15 + 0.2}s both`,
                }}
              >
                <img
                  src={member.img}
                  alt={member.name}
                  className="object-cover w-full h-full"
                  style={{ transition: 'transform 0.3s' }}
                />
              </div>
              <h3
                className="text-lg font-bold"
                style={{ fontFamily: 'Lexend Deca, sans-serif', color: '#020202' }}
              >
                {member.name}
              </h3>
              <span
                className="font-semibold text-sm mb-2"
                style={{ color: '#b8f772', fontFamily: 'Nunito Sans, sans-serif' }}
              >
                {member.role}
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* Animation styles */}
      <style>
        {`
          @keyframes teamBounce {
            0% { transform: scale(0.7) translateY(40px); opacity: 0; }
            70% { transform: scale(1.1) translateY(-8px); opacity: 1; }
            100% { transform: scale(1) translateY(0); opacity: 1; }
          }
          .team-photo-animate:hover img {
            transform: scale(1.08) rotate(-3deg);
            box-shadow: 0 12px 40px 0 #b8f77255;
          }
        `}
      </style>
    </section>
  )
}

export default Team