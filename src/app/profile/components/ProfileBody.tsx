'use client';

import React from 'react';

export const ProfileBody: React.FC<BaseProps> = ({ className }) => {
  const items = ['Item 1', 'Item 2', 'Item 3'];
  return (
    <div className={`${className}`}>
      <p>Tabs</p>
    </div>
  );
};

export default ProfileBody;
