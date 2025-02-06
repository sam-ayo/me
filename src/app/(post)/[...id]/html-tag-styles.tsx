import { Components } from 'react-markdown';

const tags: Components = {
  h1: ({ children, ...props }) => {
    return (
      <h1 className="text-2xl font-bold mb-1 dark:text-gray-100" {...props}>
        {children}
      </h1>
    );
  },
  h2: ({ children, ...props }) => {
    return (
      <h2 className="text-xl font-bold mb-1 dark:text-gray-100" {...props}>
        {children}
      </h2>
    );
  },
  h3: ({ children, ...props }) => {
    return (
      <h3 className="group font-bold text-lg my-8 relative" {...props}>
        {children}
      </h3>
    );
  },
  p: ({ children, ...props }) => {
    return (
      <p className="my-4 [blockquote_&]:my-2" {...props}>
        {children}
      </p>
    );
  },
  blockquote: ({ children, ...props }) => {
    return (
      <blockquote
        className="my-5 text-gray-500 pl-3 border-l-4 dark:border-gray-600 dark:text-gray-400"
        {...props}
      >
        {children}
      </blockquote>
    );
  },
  li: ({ children, ...props }) => {
    return (
      <li
        className={`
    my-2
    [ul_&]:relative
    [ul_&]:pl-4
    [ul_&]:before:text-gray-400
    [ul_&]:before:content-['–']
    [ul_&]:before:mr-2
    [ul_&]:before:absolute
    [ul_&]:before:-ml-4
  `}
        {...props}
      >
        {children}
      </li>
    );
  },
  code: ({ children, ...props }) => {
    return (
      <code
        className={`
        [p_&]:text-sm
        [p_&]:px-1
        [p_&]:py-0.5
        [p_&]:rounded-sm
        [p_&]:bg-gray-200
        dark:[p_&]:bg-badge-background
      `}
        {...props}
      >
        {children}
      </code>
    );
  },
};

export { tags };
