import React from 'react';
import clsx from 'clsx';

// Components
import Header from './components/Header';
import Button from './components/Button';
import Sponsors from './components/Sponsors';
import Spinner from './components/Spinner';
import { uniqBy } from 'lodash';

import { formatMoney, formatDate } from './utils';

// Utilities
import { api } from './utils/api';

/**
 * High Level Component of the whole application
 * 
 * @returns React Component
 */

const App = () => {
  const [loading, setLoading] = React.useState(false);
  const [lastPage, setLastPage] = React.useState(false);
  const [initialLoad, setInitialLoad] = React.useState(true);

  const [items, setItems] = React.useState([]);
  const [nextItems, setNextItems] = React.useState([]);
  const [nextPage, setNextPage] = React.useState(0);

  const [activeSort, setActiveSort] = React.useState('title');
  const [dropdown, setDropdown] = React.useState(false);

  const [activeAds, setActiveAds] = React.useState([]);

  const [params, setParams] = React.useState({
    _limit: 10,
    _page: 1,
  });

  const filterSort = async (type) => {
    setItems([]);
    setActiveSort(type);
    setDropdown(false);
    setLastPage(false);
    setActiveAds([]);
    setNextPage(2);
    setNextItems([]);
    setParams((curr) => ({ ...curr, _page: 1, _sort: type }));
  }

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
              setParams((curr) => {
                setNextPage((curr._page + 1) + 1);
                return { ...curr, _page: curr._page + 1 };
              });
            }
          });
        }, options);
        observer.observe(targetElement);
      }
    }
  }, [initialLoad]);

  React.useEffect(() => {
    if (!loading) sectionObserver();
  }, [sectionObserver, loading]);

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        if (initialLoad) {
          const { data: productsData } = await api().get('/products', { params: { ...params } });
          setItems((data) => ([...data, ...productsData]));
        } else {
          setItems((data) => (uniqBy([...data, ...nextItems], (v) => v.id)));
        }
        const { data: productsData } = await api().get('/products', { params: { ...params, _page: nextPage || 2 } });
        if (productsData.length <= 0) {
          setLastPage(true)
        } else {
          setNextItems(productsData)
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
  }, [params, lastPage, nextPage]);


  React.useEffect(() => {
    const randomNum = Math.floor(Math.random()*1000);

    if (items.length >= 20 && (items.length / 20) % 1 === 0 && !loading) {
      setActiveAds((curr) => {
        if (curr.includes(randomNum)) {
          return [...curr, Math.floor(Math.random()*1000)];
        } else {
          return [...curr, randomNum];
        }
      })
    }
  }, [items, loading]);

  return (
    <main id="product-list">
      <Header />
      <div className="content">
        <div className="container">
          <Sponsors activeSponsors={activeAds} />
          {!initialLoad && (
            <div className="filter-menu">
              <p className="mr-2">Sort by:</p>
              <Button type="button" label={activeSort} onClick={() => setDropdown(!dropdown)} />
              {dropdown && (
                <ul className="filter-dropdown">
                  <li className="filter-dropdown--list" role="button" onClick={() => filterSort('title')}>
                    Title
                  </li>
                  <li className="filter-dropdown--list" role="button" onClick={() => filterSort('price')}>
                    Price
                  </li>
                  <li className="filter-dropdown--list" role="button" onClick={() => filterSort('rating')}>
                    Rating
                  </li>
                </ul>
              )}
            </div>
          )}
          <div className="product-list">
            <div className="grid">
              {items?.map((item) => (
                <div key={item?.id} className="card">
                  <div className="card--image">
                    <img src={item?.thumbnail || ''} alt="display" className="cards--image" />
                  </div>
                  <div className="card--content justify-between">
                    <div className="flex flex-col">
                      <h2 className="mb-2">{item?.title || ''}</h2>
                      <p className="mb-1">{`Price: ${item?.price ? `$${formatMoney(item?.price)}` : ''}`}</p>
                    </div>
                    <p className="mb-1 text-end">Posted: {formatDate(item?.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {!loading && (
            <div id="detector" style={{ height: 1 }} />
          )}
        </div>
        {(loading || lastPage) && (
          <div className={clsx('loading--container')}>
            <div className="loading--container__label">
              {!lastPage && <Spinner />}
              <p>{lastPage ? '~ End of catalogue ~' : 'Loading...' }</p>
            </div>
          </div>
        )}
      </div>  
    </main>
  );
};

export default App;
