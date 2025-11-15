import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getQuestions } from '../api';

import PracticeMCQ from '../practice/PracticeMCQ';
import PracticeFill from '../practice/FillInTheBlank';
import PracticeMatch from '../practice/PracticeMatch';
import PracticeGeneric from '../practice/PracticeGeneric';
import TrueFalse from '../practice/TrueFalse';
import AssertionReason from '../practice/AssertionReason';
import ShortAnswer from '../practice/ShortAnswer';
import MultipleStatement from '../practice/MultipleStatement';
import Matching_MCQ from '../practice/Matching_MCQ';
import OddOneOut from '../practice/OddOneOut';
import Analogies from '../practice/Analogies';
import Ordering from '../practice/Ordering';
import Abbreviation from '../practice/Abbreviation';
import LoadingSpinner from "../components/LoadingSpinner";

export default function Practice() {
  const { classId, subject, unit_no, unit_name, type } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    getQuestions({
      class: classId,
      subject,
      unit_no,
      unit_name,
      type,
    })
      .then((qs) => {
        setQuestions(qs || []);
        setLoading(false);
      })
      .catch(() => {
        setQuestions([]);
        setLoading(false);
      });
    // 🔧 include unit_name + type so it refetches correctly
  }, [classId, subject, unit_no, unit_name, type]);

  const t = (type || '').toLowerCase().trim();

  return (
    <div>
      {/* ⭐ CLICKABLE BREADCRUMBS */}
      <div className="breadcrumbs">
        <Link to="/" className="crumb-link">
          Class {classId}
        </Link>
        <span> • </span>

        <Link
          to={`/classes/${classId}/subjects`}
          className="crumb-link"
        >
          {subject}
        </Link>
        <span> • </span>

        <Link
          to={`/classes/${classId}/subjects/${encodeURIComponent(
            subject
          )}/units`}
          className="crumb-link"
        >
          Unit {unit_no}
        </Link>
        <span> • </span>

        <Link
          to={`/practice/${classId}/${encodeURIComponent(
            subject
          )}/${unit_no}/${encodeURIComponent(unit_name)}`}
          className="crumb-link"
        >
          Question Types
        </Link>
        <span> • </span>

        <span className="muted">{type}</span>
      </div>

      {/* 🔄 LOADING / EMPTY / CONTENT */}
      {loading ? (
        <LoadingSpinner />
      ) : !questions || questions.length === 0 ? (
        <div className="card p-4">No questions found for this filter.</div>
      ) : (
        <>
          {/* MCQ / simple types */}
          {t === 'mcq' && <PracticeMCQ questions={questions} />}

          {(t === 'fillintheblank' ||
            t === 'fill' ||
            t === 'fill_in_the_blank') && (
            <PracticeFill questions={questions} />
          )}

          {(t === 'truefalse' || t === 'true_false') && (
            <TrueFalse questions={questions} />
          )}

          {(t === 'assertionreason' || t === 'assertion_reason') && (
            <AssertionReason questions={questions} />
          )}

          {(t === 'shortanswer' || t === 'short_answer') && (
            <ShortAnswer questions={questions} />
          )}

          {/* Matching styles */}
          {(t === 'match' || t === 'matching') && (
            <PracticeMatch questions={questions} />
          )}

          {(t === 'matching_mcq' || t === 'matching-mcq') && (
            <Matching_MCQ questions={questions} />
          )}

          {/* Special styles */}
          {(t === 'oddoneout' ||
            t === 'odd_one_out' ||
            t === 'odd-one-out' ||
            t === 'odd') && <OddOneOut questions={questions} />}

          {(t === 'analogies' || t === 'analogy') && (
            <Analogies questions={questions} />
          )}

          {(t === 'ordering' || t === 'order') && (
            <Ordering questions={questions} />
          )}

          {(t === 'abbreviation' ||
            t === 'abbreviations' ||
            t === 'abbr') && <Abbreviation questions={questions} />}

          {/* fallback */}
          {![
            'mcq',
            'fill',
            'fillintheblank',
            'fill_in_the_blank',
            'truefalse',
            'true_false',
            'assertionreason',
            'assertion_reason',
            'shortanswer',
            'short_answer',
            'match',
            'matching',
            'matching_mcq',
            'matching-mcq',
            'oddoneout',
            'odd_one_out',
            'odd-one-out',
            'odd',
            'analogies',
            'analogy',
            'ordering',
            'order',
            'abbreviation',
            'abbreviations',
            'abbr',
          ].includes(t) && <PracticeGeneric questions={questions} type={type} />}
        </>
      )}
    </div>
  );
}
