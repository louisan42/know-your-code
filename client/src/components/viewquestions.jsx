import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import parse from 'html-react-parser';
import '../styles/viewquestions/viewquestions.scss';
import { updateQuestions } from '../features/questionsSlice';
import Loading from './loading';
import { addQuestion } from '../features/chosenQuestionList';
// eslint-disable-next-line react/prop-types
const ViewQuestions = ({ questionType }) => {
  const { questions, questionsFetched, noData, status } = useSelector(
    (state) => state.questions
  );

  const [params] = useSearchParams();
  const dispatch = useDispatch();

  console.log('view Q');

  useEffect(() => {
    if (params.get('search')) {
      const filterItems = questionsFetched.filter((item) =>
        item.question.toLowerCase().includes(params.get('search').toLowerCase())
      );
      dispatch(updateQuestions(filterItems));
    }
  }, []);

  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const handleClick = (item) => {
    if (item !== null) {
      dispatch(addQuestion(item));
    }
  };

  if (status === 'loading') return <Loading />;

  return (
    <>
      {noData ? (
        <p>No questions found</p>
      ) : questions.length === 0 ? (
        <p>Coming soon...</p>
      ) : (
        questions.map((item, i) => (
          <div key={i} className="view-questions__container">
            <div className="view-questions__question-container">
              <p
                className="view-questions__question"
                onClick={() => {
                  if (questions.indexOf(selectedQuestion) !== i) {
                    setSelectedQuestion(questions[i]);
                  } else {
                    setSelectedQuestion(null);
                  }
                }}
                _id={item.id}>
                Q{i + 1}: {item.question}
              </p>
              <button className="list" onClick={() => handleClick(item)}>
                Add to your list
              </button>
            </div>
            {questions.indexOf(selectedQuestion) === i && (
              <>
                <p className="view-questions__answer">{item.answer}</p>
                {item.example && (
                  <>
                    <p className="view-questions__example-title">
                      Example usage:
                    </p>
                    <p className="view-questions__example">
                      {parse(item.example)}
                    </p>
                  </>
                )}
                <div className="view-questions__extra-info">
                  {item.external_source && (
                    <p className="view-questions__extra-info-ex-source">
                      Read more about this question{' '}
                      <a
                        href={item.external_source}
                        target="_blank"
                        rel="noopener noreferrer">
                        here
                      </a>
                    </p>
                  )}
                  {item.difficulty && (
                    <p className="view-questions__extra-info-level">
                      Level: <span>{item.difficulty}</span>
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        ))
      )}
    </>
  );
};

export default React.memo(ViewQuestions);
