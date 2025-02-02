import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const useViews = () => {
  const mutation = useMutation({
    mutationFn: (postId: string) => {
      return axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/views`, {
        postId,
      });
    },
  });
  return mutation;
};

export { useViews };
