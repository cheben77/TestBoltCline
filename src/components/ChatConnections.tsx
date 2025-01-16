import React from 'react';

interface ConnectionProps {
  name: string;
  icon: React.ReactNode;
  isConnected: boolean;
  onClick: () => void;
}

const Connection: React.FC<ConnectionProps> = ({ name, icon, isConnected, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
      isConnected ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`}
    title={`${isConnected ? 'Connecté' : 'Non connecté'} à ${name}`}
  >
    {icon}
    <span className="text-sm font-medium">{name}</span>
    <div className={`flex items-center gap-1 ml-1 ${isConnected ? 'text-green-600' : 'text-gray-500'}`}>
      <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-600' : 'bg-gray-400'}`} />
      <span className="text-xs">
        {isConnected ? 'Connecté' : 'Non connecté'}
      </span>
    </div>
  </button>
);

interface ChatConnectionsProps {
  connections: {
    name: string;
    isConnected: boolean;
    onClick: () => void;
  }[];
}

const ChatConnections: React.FC<ChatConnectionsProps> = ({ connections }) => {
  const getIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'steam':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2.182c5.424 0 9.818 4.394 9.818 9.818S17.424 21.818 12 21.818 2.182 17.424 2.182 12 6.576 2.182 12 2.182zm0 3.273c-3.493 0-6.545 2.382-7.418 5.727l2.862 1.182c.24-.163.527-.255.829-.255.827 0 1.5.673 1.5 1.5s-.673 1.5-1.5 1.5c-.654 0-1.209-.42-1.414-1.007L4.2 13.091C4.655 16.017 7.159 18.273 12 18.273c3.493 0 6.545-2.382 7.418-5.727l-2.862-1.182c-.24.163-.527.255-.829.255-.827 0-1.5-.673-1.5-1.5s.673-1.5 1.5-1.5c.654 0 1.209.42 1.414 1.007l2.659 1.011C19.345 7.983 16.841 5.727 12 5.727z"/>
          </svg>
        );
      case 'google drive':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12L6.95 2.578 17.05 2.578 12 12zM12 12L6.95 21.422 17.05 21.422 12 12zM3 15.5L7.5 7.5h9L21 15.5H3z"/>
          </svg>
        );
      case 'google':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.545,12.151L12.545,12.151c0,1.054,0.855,1.909,1.909,1.909h3.536c-0.607,1.972-2.405,3.404-4.545,3.404c-2.626,0-4.754-2.128-4.754-4.754s2.128-4.754,4.754-4.754c1.273,0,2.429,0.497,3.29,1.307l2.643-2.643C17.634,5.309,15.358,4.364,12.8,4.364C8.241,4.364,4.545,8.06,4.545,12.619s3.696,8.255,8.255,8.255c5.564,0,9.091-4.545,9.091-9.091c0-0.727-0.073-1.364-0.218-2.182H12.545V12.151z"/>
          </svg>
        );
      case 'youtube':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        );
      case 'notion':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-2.986-4.577c-.56-.84-.793-1.4-.793-2.146V3.504c0-1.26.887-2.286 2.304-2.47z"/>
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        );
    }
  };

  return (
    <div className="flex flex-wrap gap-2 p-4 bg-white border-b">
      <h2 className="w-full text-sm font-medium text-gray-700 mb-2">État des connexions</h2>
      {connections.map((connection) => (
        <Connection
          key={connection.name}
          name={connection.name}
          icon={getIcon(connection.name)}
          isConnected={connection.isConnected}
          onClick={connection.onClick}
        />
      ))}
    </div>
  );
};

export default ChatConnections;
