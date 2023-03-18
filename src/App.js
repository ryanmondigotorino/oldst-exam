import React from 'react';
import clsx from 'clsx';

// Components
import Header from './components/Header';
import Button from './components/Button';
import Sponsors from './components/Sponsors';

// Utilities
import { api } from './utils/api';

/**
 * High Level Component of the whole application
 * 
 * @returns React Component
 */

const App = () => {
  const [loading, setLoading] = React.useState(false);
  const [items, setItems] = React.useState([]);
  const [lastPage, setLastPage] = React.useState(false);
  const [initialLoad, setInitialLoad] = React.useState(true);

  const [activeAds, setActiveAds] = React.useState([]);

  const [params, setParams] = React.useState({
    _limit: null,
    _page: 1,
    _sort: null,
  });

  const sectionObserver = React.useCallback(() => {
    if (!initialLoad) {
      const options = {
        root: document.getElementById('product-list'),
        rootMargin: "0px",
        threshold: 1,
      };
      const targetElement = document.getElementById('detector');
      if (targetElement) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setParams((curr) => ({ ...curr, _page: curr._page + 1}))
            }
          });
        }, options);
        observer.observe(targetElement);
      }
    }
  }, [initialLoad]);

  React.useEffect(() => {
    sectionObserver();
  }, [sectionObserver]);

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data: productsData } = await api().get('/products', { params: { ...params } });
        if (productsData.length <= 0) {
          setLastPage(true)
        } else {
          setItems((data) => ([...data, ...productsData]));
        }
        setLoading(false);
        if (initialLoad) setInitialLoad(false);
      } catch {
        console.error('Error Fetching products')
      }
    };

    if (!lastPage) {
      fetchProducts();
    }
  }, [params, lastPage]);

  React.useEffect(() => {
    const randomNum = Math.floor(Math.random()*1000);

    if (items.length >= 20 && (items.length / 20) % 1 === 0) {
      setActiveAds((curr) => {
        if (curr.includes(randomNum)) {
          return [...curr, Math.floor(Math.random()*1000)];
        } else {
          return [...curr, randomNum];
        }
      })
    }
  }, [items]);

  console.log({ activeAds })

  return (
    <main>
      <Header />
      <div className="content">
        <div className="container">
          <Sponsors activeSponsors={activeAds} />
          {!initialLoad && (
            <div className="filter-menu">
              <p className="mr-2">Sort by:</p>
              <Button type="button" label="Price" />
            </div>
          )}
        </div>
        <div id="product-list" className="product-list">
          <div className="container">
            <div className="grid">
              {items?.map((item) => (
                <div key={item?.id} className="card">
                  <div className="card--image">
                    <img src={item?.thumbnail || ''} alt="display" className="cards--image" />
                  </div>
                  <div className="card--content justify-between">
                    <div className="flex flex-col">
                      <h2 className="mb-2">{item?.title || ''}</h2>
                      <p className="mb-1">{item?.price || ''}</p>
                    </div>
                    <p className="mb-1 text-end">Posted: 2 days ago</p>
                  </div>
                </div>
              ))}
            </div>
            <div id="detector" style={{ height: 1 }} />
            {(loading || lastPage) && (
              <div className={clsx('loading--container', { relative: lastPage })}>
                <div className="loading--container__label">
                  <p>{lastPage ? 'End of Result' : 'Loading Products...' }</p>
                </div>
              </div>
            )}
          </div>
          {!initialLoad && (
            <footer className="footer">
              <p>&copy; Created by: Ryan M. Torino</p>
            </footer>
          )}
        </div>
      </div>
    </main>
  );
};

export default App;
