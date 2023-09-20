import { User } from '@prisma/client';
import { Link } from '@nextui-org/react';
import React from 'react';
import {
  FaXTwitter,
  FaFacebook,
  FaGlobe,
  FaInstagram,
  FaLinkedin,
  FaGithub,
  FaYoutube,
} from 'react-icons/fa6';

type Props = {
  user: User;
};

export default function WebsiteLink({ user }: Props) {
  const icon = getIcon(user.website || '');
  return (
    <div className="flex mt-1.5 gap-2 items-center text-sm">
      {icon}
      <Link target="_blank" href={user.website || ''}>
        {displayWebsiteAs(user.website || '')}
      </Link>
    </div>
  );
}

/**
 * if a website is a social profile like twitter.com/username, it should return username other wise it should return the website
 * @param website
 * @returns
 */
function displayWebsiteAs(website: string) {
  return website
    .replace('https://', '')
    .replace('http://', '')
    .replace('www.', '');
}

function getIcon(website: string) {
  const size = 16;
  if (website.includes('twitter.com') || website.includes('x.com')) {
    return <FaXTwitter size={size} />;
  } else if (website.includes('facebook.com')) {
    return <FaFacebook size={size} />;
  } else if (website.includes('instagram.com')) {
    return <FaInstagram size={size} />;
  } else if (website.includes('linkedin.com')) {
    return <FaLinkedin size={size} />;
  } else if (website.includes('github.com')) {
    return <FaGithub size={size} />;
  } else if (website.includes('youtube.com')) {
    return <FaYoutube size={size} />;
  }

  return <FaGlobe size={size} />;
}
