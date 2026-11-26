import { Icon } from '../Icon';
import type { SharingDetail, SharingRound } from './rounds';

export const puppyPhoto = `${import.meta.env.BASE_URL}sharing/puppy.webp`;
const travelPhoto = `${import.meta.env.BASE_URL}sharing/travel.webp`;
const parkPhoto = `${import.meta.env.BASE_URL}sharing/park.webp`;

export function SharingPreview({ round, visibleDetails, onToggleDetail }: {
  round: SharingRound;
  visibleDetails: readonly SharingDetail[];
  onToggleDetail?: (id: string) => void;
}) {
  function renderDetail(id: string, className = '') {
    const detail = round.details.find((item) => item.id === id);
    if (!detail) return null;

    const isHidden = !visibleDetails.some((item) => item.id === id);
    const classes = `sharing-detail ${className}${isHidden ? ' is-hidden' : ''}`;

    if (onToggleDetail) {
      const visibleLabel = isHidden ? 'Hidden' : detail.value;
      return <button type="button" className={classes} aria-label={`${visibleLabel} · ${detail.label}`}
        aria-pressed={isHidden} onClick={() => onToggleDetail(id)}>
        {visibleLabel}
      </button>;
    }

    return <span className={classes}>
      {isHidden ? <span className="sr-only">{detail.label} hidden</span> : detail.value}
    </span>;
  }

  switch (round.preview) {
    case 'puppy':
      return <figure className="sharing-preview">
        <div className="sharing-photo">
          <img src={puppyPhoto} alt="Maple the puppy sits on a rug next to a parcel." width="900" height="600" />
          {renderDetail('address', 'parcel-label')}
        </div>
        <figcaption>{renderDetail('caption')}</figcaption>
      </figure>;
    case 'boarding-pass':
      return <figure className="sharing-preview sharing-photo">
        <img src={travelPhoto} alt="Alex takes a selfie in an airport lounge with a boarding pass in the frame." width="900" height="600" />
        <div className={onToggleDetail ? 'travel-ticket ticket-editing' : 'travel-ticket'}>
          <strong>Boarding pass</strong>
          {renderDetail('passenger')}
          {renderDetail('trip')}
          <span className="booking-label">Booking reference</span>
          {renderDetail('booking')}
        </div>
      </figure>;
    case 'chat':
      return <div className="sharing-preview chat-preview">
        <div className="chat-header">
          <span className="avatar" aria-hidden="true">J</span>
          <div><strong>Jamie</strong><small>Picnic planning</small></div>
        </div>
        <div className="chat-bubble">{renderDetail('message')}</div>
        <div className="chat-bubble">My number for the day<br />{renderDetail('phone')}</div>
      </div>;
    case 'location':
      return <div className="sharing-preview location-preview">
        {visibleDetails.length > 0 && (
          <div className="location-map" aria-hidden="true"><span><Icon name="pin" size={30} /></span></div>
        )}
        <div className="location-caption"><strong>{renderDetail('location')}</strong><small>Live location · 15 minutes</small></div>
      </div>;
    case 'park':
      return <figure className="sharing-preview">
        <img src={parkPhoto} alt="A quiet path through green trees and wildflowers." width="900" height="600" />
        <figcaption>{renderDetail('caption')}</figcaption>
      </figure>;
  }
}
