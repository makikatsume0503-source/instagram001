import React from 'react';
import { DownloadCloud } from 'lucide-react';

// Static SVG assets mapped to standard use-case icons
const getIconSvg = (iconName) => {
  switch (iconName) {
    case 'text':
      return (
        <svg className="slide-icon" viewBox="0 0 24 24" fill="none" stroke="url(#goldGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="150" height="150">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <path d="M14 2v6h6"></path>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <line x1="10" y1="9" x2="8" y2="9"></line>
        </svg>
      );
    case 'image':
      return (
        <svg className="slide-icon" viewBox="0 0 24 24" fill="none" stroke="url(#goldGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="150" height="150">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
      );
    case 'docs':
      return (
        <svg className="slide-icon" viewBox="0 0 24 24" fill="none" stroke="url(#goldGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="150" height="150">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
        </svg>
      );
    case 'website':
      return (
        <svg className="slide-icon" viewBox="0 0 24 24" fill="none" stroke="url(#goldGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="150" height="150">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
          <line x1="8" y1="21" x2="16" y2="21"></line>
          <line x1="12" y1="17" x2="12" y2="21"></line>
        </svg>
      );
    case 'app':
      return (
        <svg className="slide-icon" viewBox="0 0 24 24" fill="none" stroke="url(#goldGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="150" height="150">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
          <line x1="12" y1="18" x2="12.01" y2="18"></line>
          <path d="M16 2v2a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V2"></path>
        </svg>
      );
    case 'search':
      return (
        <svg className="slide-icon" viewBox="0 0 24 24" fill="none" stroke="url(#goldGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="150" height="150">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          <line x1="11" y1="8" x2="11" y2="14"></line>
          <line x1="8" y1="11" x2="14" y2="11"></line>
        </svg>
      );
    case 'brain':
      return (
        <svg className="slide-icon" viewBox="0 0 24 24" fill="none" stroke="url(#goldGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="150" height="150">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
      );
    default:
      return null;
  }
};

const Slide = ({ data, id }) => {
  const renderContent = () => {
    switch (data.type) {
      case 'cover':
        return (
          <>
            <div className="cover-catchphrase" style={{ fontSize: data.catchphraseScale ? `${data.catchphraseScale * 100}%` : undefined }} dangerouslySetInnerHTML={{ __html: data.catchphrase }}></div>
            <div className="slide-title gold-text" style={{ fontSize: data.titleScale ? `${data.titleScale * 100}%` : undefined }} dangerouslySetInnerHTML={{ __html: data.title }}></div>
            <div className="instructor-tag" style={{ fontSize: data.footerScale ? `${data.footerScale * 100}%` : undefined }}>{data.footer}</div>
          </>
        );
      case 'list':
        return (
          <>
            <div className="slide-subtitle gold-text" style={{ fontSize: data.titleScale ? `${data.titleScale * 100}%` : undefined }}>{data.title}</div>
            <div className="slide-body" style={{ fontSize: data.bodyScale ? `${data.bodyScale * 100}%` : undefined }}>
              {data.displayMode === 'text' ? (
                <div dangerouslySetInnerHTML={{ __html: data.bodyText || '' }}></div>
              ) : (
                <ul>
                  {data.bullets?.map((bullet, index) => (
                    <li key={index}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
            {data.icon && (
              <div className="slide-icon-wrapper">
                {getIconSvg(data.icon)}
              </div>
            )}
            {data.footer && <div className="instructor-tag">{data.footer}</div>}
          </>
        );
      case 'cta':
        return (
          <>
            <div className="cta-text gold-text" style={{ fontSize: data.titleScale ? `${data.titleScale * 100}%` : undefined }} dangerouslySetInnerHTML={{ __html: data.title }}></div>
            <div className="cta-subtext" style={{ fontSize: data.catchphraseScale ? `${data.catchphraseScale * 100}%` : undefined }} dangerouslySetInnerHTML={{ __html: data.subtitle }}></div>
            <div className="cta-action" style={{ fontSize: data.footerScale ? `${data.footerScale * 100}%` : undefined }}>{data.buttonText}</div>
          </>
        );
      case 'profile':
        return (
          <div className="profile-container">
            <div className="profile-image-wrapper">
              <img src={data.imageSrc} alt={data.name} className="profile-image" />
            </div>
            <div className="profile-name" style={{ fontSize: data.nameScale ? `${data.nameScale * 100}%` : undefined }}>{data.name}</div>
            <div className="profile-title" style={{ fontSize: data.roleScale ? `${data.roleScale * 100}%` : undefined }}>{data.role}</div>
            <div className="profile-catchphrase" style={{ fontSize: data.catchphraseScale ? `${data.catchphraseScale * 100}%` : undefined }} dangerouslySetInnerHTML={{ __html: data.catchphrase }}></div>
            <div className="profile-services" style={{ fontSize: data.servicesScale ? `${data.servicesScale * 100}%` : undefined }}>
              <div className="profile-services-title">サービス内容</div>
              <ul>
                {data.services.map((service, index) => (
                  <li key={index}>{service}</li>
                ))}
              </ul>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="slide-container" id={id} style={{ backgroundImage: `url('${data.bgImage}')` }}>
      {/* SVG Definitions block local to slide to ensure rendering in png exports */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#e6c565" />
            <stop offset="50%" stopColor="#ffebb0" />
            <stop offset="100%" stopColor="#e6c565" />
          </linearGradient>
        </defs>
      </svg>
      {renderContent()}
    </div>
  );
};

export default Slide;
