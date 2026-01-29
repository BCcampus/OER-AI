/**
 * Migration: Add default prompt templates and guided prompt questions
 *
 * This migration inserts the default prompt templates used for the OER AI assistant,
 * including RAG-type prompts and guided prompts with their associated questions.
 */

exports.up = (pgm) => {
  // Insert RAG prompt templates
  pgm.sql(`
    -- Insert RAG prompt templates
    INSERT INTO prompt_templates (id, name, description, type, visibility, created_at)
    VALUES 
      (
        uuid_generate_v4(),
        'Break down a complex formula',
        'Provide a step-by-step deconstruction of a mathematical or scientific equation.

1. Identify the formula: [FORMULA_TO_BREAK_DOWN].

2. For each variable or constant in the formula, provide a simple explanation of its meaning and its [UNIT_OF_MEASUREMENT].

3. Explain, step-by-step, the [NUMBER] steps required to use the formula to solve for the [TARGET_VARIABLE].

4. Explain the overall purpose or meaning of the formula in [SIMPLE_TERMS].

5. Explain the formula in a way that addresses  [Indigenous ways of knowing and being], [Learners with Autism, ADHD, dyslexia, or other neurodiversity], [Cultural considerations].',
        'RAG',
        'public',
        NOW()
      ),
      (
        uuid_generate_v4(),
        'Compare and contrast topics',
        'Draft a comprehensive comparative analysis of two related subjects.

1. Identify the three most significant similarities between [TOPIC_A] and [TOPIC_B].

2. Identify the three most fundamental differences between [TOPIC_A] and [TOPIC_B].

3. Analyze the [RELATIONSHIP_TYPE: e.g., competitive, sequential, dependent] between the two topics.

4. Present the analysis structured into two clear paragraphs, focusing on the context of [ACADEMIC_COURSE_NAME].

5. The analysis must incorporate [Indigenous ways of knowing and being], [Learners with Autism, ADHD, dyslexia, or other neurodiversity], [Cultural considerations].',
        'RAG',
        'public',
        NOW()
      ),
      (
        uuid_generate_v4(),
        'Create a study guide outline',
        'Generate a structured, hierarchical outline for a comprehensive study guide.

1. Create a detailed outline for a study guide covering the [BROAD_COURSE_OR_UNIT].

2. The outline must contain at least [NUMBER] main sections and a total of [NUMBER_OF_SUBPOINTS] sub-points across all sections.

3. The structure should prioritize the most crucial concepts, specifically [MOST_CRITICAL_CONCEPT].

4. The outline must use standard hierarchical notation (e.g., I., A., 1., a.).

5. The outline must include ways to support  [Indigenous ways of knowing and being], [Learners with Autism, ADHD, dyslexia, or other neurodiversity], [Cultural considerations].',
        'RAG',
        'public',
        NOW()
      ),
      (
        uuid_generate_v4(),
        'Create practice questions',
        'Generate a targeted set of mixed-format questions for self-assessment.

1. Generate a total of [NUMBER] questions covering the topic [SUBJECT_TOPIC].

2. The set should include a mix of [NUMBER_MCQ] multiple-choice questions, [NUMBER_T/F] true/false questions, and [NUMBER_SHORT_ANSWER] short-answer questions.

3. Focus primarily on the material presented in [SPECIFIC_SECTION_OR_SOURCE].

4. Provide the correct answer immediately after each question, clearly marked as [ANSWER_LABEL: e.g., Answer, Solution, Key].',
        'RAG',
        'public',
        NOW()
      ),
      (
        uuid_generate_v4(),
        'Define and explain a term',
        'Provide a detailed and authoritative explanation of a key concept.

1. Start with a formal, single-sentence definition of the term [TERM_TO_DEFINE].

2. Provide a clear breakdown of its [NUMBER] essential components or characteristics.

3. Describe the historical context or origin of the term in [ONE_SENTENCE].

4. Explain the significance of [TERM_TO_DEFINE] within the broader field of [ACADEMIC_FIELD].',
        'RAG',
        'public',
        NOW()
      ),
      (
        uuid_generate_v4(),
        'Explain a concept in simple terms',
        'Your goal is to simplify a complex idea for easy understanding.

1. Take the concept [COMPLEX_CONCEPT] and explain it using language appropriate for a [CHILD_AGE_OR_GRADE] audience.

2. Use a single, relatable [TYPE_OF_ANALOGY: e.g., sports, cooking, building blocks] to illustrate the main mechanism.

3. Avoid using any specialized jargon. If a key term must be mentioned, it should be defined immediately.

4. The final explanation should not exceed [WORD_COUNT_MAX] words.

5. The final explanation must include a connection to [Indigenous ways of knowing and being], [Learners with Autism, ADHD, dyslexia, or other neurodiversity], [Cultural considerations].',
        'RAG',
        'public',
        NOW()
      ),
      (
        uuid_generate_v4(),
        'Explain with analogies',
        'Provide a series of different conceptual metaphors for a single abstract idea.

1. Generate [NUMBER] distinct, creative analogies to explain the abstract concept of [ABSTRACT_CONCEPT].

2. Ensure each analogy is drawn from a different domain (e.g., one from nature, one from technology, one from social life).

3. For each analogy, explain why the comparison holds true in a single sentence, focusing on the property [KEY_PROPERTY_OF_CONCEPT].

4. Consider the following when generating the analogies [Indigenous ways of knowing and being], [Learners with Autism, ADHD, dyslexia or other neurodiversity], [Cultural considerations].',
        'RAG',
        'public',
        NOW()
      ),
      (
        uuid_generate_v4(),
        'Generate an example problem',
        'Generate a realistic and challenging problem that requires understanding of a specific concept.

1. Create a word problem or scenario based on [CONCEPT_OR_FORMULA].

2. Set the problem difficulty to [DIFFICULTY_LEVEL: e.g., Beginner, Intermediate, Advanced].

3. The problem should be applicable to [REAL_WORLD_CONTEXT: e.g., finance, physics, engineering].

4. Provide a clear question at the end that asks the user to calculate [FINAL_ANSWER_UNIT: e.g., velocity, net profit, historical date].

5. Include the [TYPE_OF_DATA_REQUIRED: e.g., constants, initial conditions, dates] needed to solve it.',
        'RAG',
        'public',
        NOW()
      ),
      (
        uuid_generate_v4(),
        'Provide real-world applications',
        'Find specific, practical examples where a theory is used outside of the classroom.

1. List three distinct real-world applications of the principle or theory [THEORY_OR_PRINCIPLE].

2. For each application, provide a detailed description of how the principle is implemented in [INDUSTRY_OR_FIELD].

3. Each description should be a minimum of [SENTENCE_MINIMUM] sentences.

4. The applications should be geared toward a [STUDENT_AUDIENCE_LEVEL] audience.

5. The applications must include  [Indigenous ways of knowing and being], [Learners with Autism, ADHD, dyslexia, or other neurodiversity], [Cultural considerations].',
        'RAG',
        'public',
        NOW()
      ),
      (
        uuid_generate_v4(),
        'Quiz me on key concepts',
        'Generate a short, interactive quiz to test my knowledge immediately.

1. Create a quiz of [NUMBER] questions focused strictly on [NARROW_TOPIC_FOCUS].

2. The quiz format must be [QUIZ_FORMAT: e.g., Multiple Choice, Fill-in-the-Blank, Short Answer].

3. I will provide my answer after each question. Your response should contain only the next question until I say [COMMAND_TO_END_QUIZ: e.g., ''End Quiz'' or ''Stop''].

4. The first question is: [FIRST_QUESTION_TEXT]',
        'RAG',
        'public',
        NOW()
      ),
      (
        uuid_generate_v4(),
        'Suggest study strategies',
        'Generate personalized and effective strategies for mastering a challenging subject.

1. Suggest [NUMBER] specific study techniques tailored for improving comprehension of [CHALLENGING_SUBJECT].

2. One strategy must involve [ACTIVE_LEARNING_METHOD: e.g., teaching someone, flashcards, problem-solving].

3. Another strategy must focus on [TIME_MANAGEMENT_METHOD: e.g., Pomodoro, spaced repetition].

4. Explain the rationale behind each strategy in a maximum of [SENTENCE_MAX] sentences.

5. The study strategies provided must include ways to support  [Indigenous ways of knowing and being], [Learners with Autism, ADHD, dyslexia, or other neurodiversity], [Cultural considerations].',
        'RAG',
        'public',
        NOW()
      ),
      (
        uuid_generate_v4(),
        'Summarize a Chapter',
        'Act as an expert academic assistant. Your task is to provide a concise and comprehensive summary of a single chapter.

1. Identify the three primary learning objectives or core arguments of [CHAPTER_TITLE] from the [TEXTBOOK_NAME] text.

2. Synthesize the main content into a maximum of [NUMBER] paragraphs.

3. Ensure the summary is tailored for a student at the [GRADE_LEVEL_OR_COURSE] level.

4. Conclude the summary with a list of three critical vocabulary terms from the chapter.',
        'RAG',
        'public',
        NOW()
      )
    ON CONFLICT (name) DO NOTHING;
  `);

  // Insert guided prompt template
  pgm.sql(`
    INSERT INTO prompt_templates (id, name, description, type, visibility, created_at)
    VALUES (
      uuid_generate_v4(),
      'Detailed Lesson Plan Generator',
      'Create a detailed lesson plan for [subject] targeting [grade_level] students. The lesson will focus on [topic] and run for [duration]. Learning objectives include [objectives]. Students have [prior_knowledge] background. The lesson should incorporate [teaching_methods] and include [assessment_type] for evaluation. Materials needed: [materials]. Special considerations: [accommodations].

Please structure the lesson plan with:
1. Clear learning objectives aligned with curriculum standards
2. Detailed timeline with activities and transitions
3. Multiple teaching strategies to accommodate different learning styles
4. Formative and summative assessment opportunities
5. Extension activities for advanced learners
6. Modifications for students who need additional support
7. Required materials and technology integration
8. Reflection questions for students
9. Homework or follow-up activities
10. Assessment rubric with clear criteria

Ensure the lesson promotes active learning, critical thinking, and student engagement while meeting educational standards.',
      'guided',
      'public',
      NOW()
    )
    ON CONFLICT (name) DO NOTHING;
  `);

  // Insert guided prompt questions for the Detailed Lesson Plan Generator
  pgm.sql(`
    INSERT INTO guided_prompt_questions (id, prompt_template_id, question_text, order_index)
    SELECT 
      uuid_generate_v4(),
      pt.id,
      q.question_text,
      q.order_index
    FROM prompt_templates pt
    CROSS JOIN (
      VALUES 
        ('What subject area is this lesson for? (e.g., Mathematics, Science, English Language Arts, Social Studies)', 1),
        ('What grade level are you targeting? (e.g., Grade 3, High School, College Freshman)', 2),
        ('What specific topic will the lesson focus on? (e.g., Fractions, Photosynthesis, Essay Writing)', 3),
        ('How long will the lesson run? (e.g., 45 minutes, 90 minutes, 2 hours)', 4),
        ('What are the main learning objectives for this lesson?', 5),
        ('What prior knowledge should students have before this lesson?', 6),
        ('What teaching methods would you like to incorporate? (e.g., direct instruction, group work, hands-on activities)', 7),
        ('What type of assessment would you like to include? (e.g., quiz, project, discussion, observation)', 8),
        ('What materials and resources are available for this lesson?', 9),
        ('Are there any special accommodations or considerations needed for students?', 10)
    ) AS q(question_text, order_index)
    WHERE pt.name = 'Detailed Lesson Plan Generator'
    ON CONFLICT DO NOTHING;
  `);
};

exports.down = (pgm) => {
  // Remove guided prompt questions first (due to foreign key constraint)
  pgm.sql(`
    DELETE FROM guided_prompt_questions 
    WHERE prompt_template_id IN (
      SELECT id FROM prompt_templates WHERE name = 'Detailed Lesson Plan Generator'
    );
  `);

  // Remove all prompt templates added by this migration
  pgm.sql(`
    DELETE FROM prompt_templates WHERE name IN (
      'Break down a complex formula',
      'Compare and contrast topics',
      'Create a study guide outline',
      'Create practice questions',
      'Define and explain a term',
      'Explain a concept in simple terms',
      'Explain with analogies',
      'Generate an example problem',
      'Provide real-world applications',
      'Quiz me on key concepts',
      'Suggest study strategies',
      'Summarize a Chapter',
      'Detailed Lesson Plan Generator'
    );
  `);
};
