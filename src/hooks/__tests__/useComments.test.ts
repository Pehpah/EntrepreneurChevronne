import { renderHook, act } from '@testing-library/react';
import { useComments } from '../useComments';
import { useLocalStorage } from '../useLocalStorage';

// Mock useLocalStorage
vi.mock('../useLocalStorage');

const mockSetComments = vi.fn();
const mockUseLocalStorage = useLocalStorage as any;

beforeEach(() => {
  mockUseLocalStorage.mockReturnValue([[], mockSetComments]);
});

describe('useComments Hook', () => {
  const articleId = 'test-article-1';

  it('initializes with empty comments', () => {
    const { result } = renderHook(() => useComments(articleId));
    
    expect(result.current.comments).toEqual([]);
  });

  it('adds a new comment', () => {
    const { result } = renderHook(() => useComments(articleId));
    
    const newComment = {
      articleId,
      author: 'John Doe',
      email: 'john@example.com',
      content: 'Great article!'
    };

    act(() => {
      result.current.addComment(newComment);
    });

    expect(mockSetComments).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          ...newComment,
          id: expect.any(String),
          publishedAt: expect.any(String)
        })
      ])
    );
  });

  it('adds a reply to existing comment', () => {
    const existingComments = [
      {
        id: 'comment-1',
        articleId,
        author: 'Jane',
        email: 'jane@example.com',
        content: 'First comment',
        publishedAt: '2024-01-01T00:00:00.000Z',
        replies: []
      }
    ];

    mockUseLocalStorage.mockReturnValue([existingComments, mockSetComments]);
    
    const { result } = renderHook(() => useComments(articleId));
    
    const reply = {
      articleId,
      author: 'John',
      email: 'john@example.com',
      content: 'Reply to Jane'
    };

    act(() => {
      result.current.addReply('comment-1', reply);
    });

    expect(mockSetComments).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'comment-1',
          replies: expect.arrayContaining([
            expect.objectContaining({
              ...reply,
              id: expect.any(String),
              publishedAt: expect.any(String)
            })
          ])
        })
      ])
    );
  });

  it('deletes a comment', () => {
    const existingComments = [
      {
        id: 'comment-1',
        articleId,
        author: 'Jane',
        email: 'jane@example.com',
        content: 'First comment',
        publishedAt: '2024-01-01T00:00:00.000Z'
      },
      {
        id: 'comment-2',
        articleId,
        author: 'John',
        email: 'john@example.com',
        content: 'Second comment',
        publishedAt: '2024-01-01T00:00:00.000Z'
      }
    ];

    mockUseLocalStorage.mockReturnValue([existingComments, mockSetComments]);
    
    const { result } = renderHook(() => useComments(articleId));

    act(() => {
      result.current.deleteComment('comment-1');
    });

    expect(mockSetComments).toHaveBeenCalledWith([
      expect.objectContaining({ id: 'comment-2' })
    ]);
  });

  it('filters comments by article ID', () => {
    const allComments = [
      {
        id: 'comment-1',
        articleId: 'article-1',
        author: 'Jane',
        email: 'jane@example.com',
        content: 'Comment for article 1',
        publishedAt: '2024-01-01T00:00:00.000Z'
      },
      {
        id: 'comment-2',
        articleId: 'article-2',
        author: 'John',
        email: 'john@example.com',
        content: 'Comment for article 2',
        publishedAt: '2024-01-01T00:00:00.000Z'
      }
    ];

    mockUseLocalStorage.mockReturnValue([allComments, mockSetComments]);
    
    const { result } = renderHook(() => useComments('article-1'));

    expect(result.current.comments).toHaveLength(1);
    expect(result.current.comments[0].content).toBe('Comment for article 1');
  });
});