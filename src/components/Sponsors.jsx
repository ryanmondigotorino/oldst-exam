import React from 'react';

const Sponsors = ({ activeSponsors }) => {
  return (
    <div className="sponsors">
      <h3 className="mb-2">
        {activeSponsors?.length ? `But first, a word from our sponsors:` : 'Checkout our products available below:'}
      </h3>
      <div className="sponsors--container">
        {activeSponsors?.length > 0 ? (
          <>
            {activeSponsors?.map((v, key) => (
              <div key={key} className="sponsors--content">
                <img
                  src={`http://localhost:8000/ads/?r=${v}}`}
                  alt='ad'
                />
              </div>
            ))}
          </>
        ) : <div className="sponsors--content" />}
      </div>
    </div>
  )
};

export default Sponsors