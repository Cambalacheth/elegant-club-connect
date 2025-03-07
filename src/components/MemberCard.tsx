
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';

interface MemberCardProps {
  member: {
    username: string;
    level: string;
    category: string;
    avatar_url: string | null;
  };
}

const MemberCard = ({ member }: MemberCardProps) => {
  return (
    <Link to={`/user/${member.username}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
        <div className="p-3 md:p-4 flex flex-col items-center">
          {/* Avatar */}
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-club-beige-dark overflow-hidden mb-3 md:mb-4 flex justify-center items-center">
            {member.avatar_url ? (
              <img 
                src={member.avatar_url} 
                alt={`${member.username} avatar`} 
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <User size={32} className="text-club-brown opacity-70" />
            )}
          </div>
          
          {/* Member Info */}
          <div className="text-center">
            <h3 className="font-medium text-base md:text-lg text-club-brown mb-1">{member.username}</h3>
            <div className="text-xs md:text-sm text-club-brown/80 mb-2">{member.level}</div>
            <span className="inline-block bg-club-beige px-2 py-0.5 md:px-3 md:py-1 rounded-full text-xs font-medium text-club-brown">
              {member.category}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MemberCard;
