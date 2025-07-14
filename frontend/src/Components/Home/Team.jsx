import React from 'react'
import member1 from '../../assets/city.png'
import member2 from '../../assets/city.png'
import member3 from '../../assets/city.png'
import member4 from '../../assets/city.png'
import '../../styles/Team.css'

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
    <section className="team-section">
      <div className="team-header">
        <h2 className="team-title">
          Meet Our Team
        </h2>
        <p className="team-description">
          The passionate individuals behind Mission13, working together to create a sustainable future for everyone.
        </p>
      </div>

      <div className="team-grid">
        {team.map((member, idx) => (
          <div key={member.name} className="team-member">
            <div className="team-card glass-card">
              <div
                className="team-photo-container"
                style={{
                  animation: `teamBounce 1.2s ${idx * 0.15 + 0.2}s both`,
                }}
              >
                <img
                  src={member.img}
                  alt={member.name}
                  className="team-photo"
                />
              </div>
              <h3 className="member-name">
                {member.name}
              </h3>
              <span className="member-role">
                {member.role}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Team