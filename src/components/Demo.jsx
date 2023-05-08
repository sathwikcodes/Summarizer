import React from "react";
import { useState, useEffect } from "react";
import { copy, linkIcon, loader, tick } from "../assets";
import { useLazyGetSummaryQuery } from "../services/article";

const Demo = () => {
  const [allArticles, setAllArticles] = useState([]);
  const [copied, setCopied] = useState('');
  const [article, setArticle] = useState({
    url: "",
    summary: "",
  });

  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

  useEffect(() => {
    const articlesfromlocalStorage = JSON.parse(
      localStorage.getItem("articles")
    );
    if (articlesfromlocalStorage) {
      setAllArticles(articlesfromlocalStorage);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await getSummary({ articleUrl: article.url });
    if (data?.summary) {
      const newArticle = { ...article, summary: data.summary };
      const updatedArticles = [newArticle, ...allArticles];
      setArticle(newArticle);
      setAllArticles(updatedArticles);

      localStorage.setItem("articles", JSON.stringify(updatedArticles));
    }
  };

  const handleCopy = (copyurl) => {
    setCopied(copyurl);
    navigator.clipboard.writeText(copyurl);
    setTimeout(() => setCopied(false), 300)
  }
  return (
    <section className="mt-16 w-full max-w-xl">
      {/* search */}
      <div className="flex flex-col w-full gap-2 ">
        <form
          className="relative flex justify-center items-center"
          onSubmit={handleSubmit}
        >
          <img src={linkIcon} className="absolute left-0 my-2 ml-3 w-5" />
          <input
            value={article.url}
            type="url"
            placeholder="Enter a URL"
            onChange={(e) =>
              setArticle({
                ...article,
                url: e.target.value,
              })
            }
            required
            className="url_input peer"
          />
          <button
            type="submit"
            className="submit_btn peer-focus:border-gray-700 peer-focus:text-grey-700"
          >
            <p>↵</p>
          </button>
        </form>
        {/* History */}
        <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
          {allArticles.map((item, index) => (
            <div
              key={`link-${index}`}
              onClick={() => setArticle(item)}
              className="link_card"
            >
              <div className="copy_btn" onClick={() => handleCopy(item.url) }>
                <img 
                  src={copied === item.url ? tick : copy}
                  alt='copy'
                  className="w-[40%] h-[40%] object-contain "
                />
              </div>
              <p className="flex-1 font-satoshi text-blue-700 font-medium text-sm truncate " >{item.url}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Results */}
      <div className="my-10 max-w-full flex justify-center items-center" >
            {isFetching ? (
              <img src={loader} alt='loader' className="w-20 h-20 object-contain" />
              
            ): error ? (
              <p className="font-inter font-bold text-black text-center" >Well, that wasn't supposed to happen... 
              <br />
              <span className="font-satoshi font-normal text-grey-700" >
                {error?.data?.error}
              </span>
              </p>
            ) : (
              article.summary && (
                <div className='flex flex-col gap-3'>
                <h2 className="font-satoshi font-bold text-grey-600 text-xl" >
                  Article <span className="blue_gradient" >Summary</span>
                </h2>
                <div className="summary_box" >
                  <p className="font-inter font-medium font-sm text-grey-700" >{article.summary}</p>
                </div>
                </div>
              )
            )
            }
      </div>
    </section>
  );
};

export default Demo;
