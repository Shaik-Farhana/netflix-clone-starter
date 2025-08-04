-- Insert sample content
INSERT INTO public.content (title, description, type, genre, release_year, duration_minutes, rating, poster_url, backdrop_url) VALUES
('The Matrix', 'A computer programmer discovers reality is a simulation and joins a rebellion against the machines.', 'movie', '{"Action", "Sci-Fi"}', 1999, 136, 8.7, '/placeholder.svg?height=600&width=400', '/placeholder.svg?height=1080&width=1920'),
('Stranger Things', 'A group of kids in a small town uncover supernatural mysteries and government conspiracies.', 'tv_show', '{"Drama", "Fantasy", "Horror"}', 2016, 50, 8.7, '/placeholder.svg?height=600&width=400', '/placeholder.svg?height=1080&width=1920'),
('Inception', 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.', 'movie', '{"Action", "Sci-Fi", "Thriller"}', 2010, 148, 8.8, '/placeholder.svg?height=600&width=400', '/placeholder.svg?height=1080&width=1920'),
('Breaking Bad', 'A high school chemistry teacher turned methamphetamine manufacturer partners with a former student.', 'tv_show', '{"Crime", "Drama", "Thriller"}', 2008, 47, 9.5, '/placeholder.svg?height=600&width=400', '/placeholder.svg?height=1080&width=1920'),
('The Dark Knight', 'Batman faces the Joker, a criminal mastermind who wants to plunge Gotham City into anarchy.', 'movie', '{"Action", "Crime", "Drama"}', 2008, 152, 9.0, '/placeholder.svg?height=600&width=400', '/placeholder.svg?height=1080&width=1920'),
('The Office', 'A mockumentary sitcom about the everyday lives of office employees working at a paper company.', 'tv_show', '{"Comedy"}', 2005, 22, 8.9, '/placeholder.svg?height=600&width=400', '/placeholder.svg?height=1080&width=1920'),
('Pulp Fiction', 'The lives of two mob hitmen, a boxer, and others intertwine in four tales of violence and redemption.', 'movie', '{"Crime", "Drama"}', 1994, 154, 8.9, '/placeholder.svg?height=600&width=400', '/placeholder.svg?height=1080&width=1920'),
('Game of Thrones', 'Nine noble families fight for control over the lands of Westeros while an ancient enemy returns.', 'tv_show', '{"Action", "Adventure", "Drama"}', 2011, 57, 9.3, '/placeholder.svg?height=600&width=400', '/placeholder.svg?height=1080&width=1920'),
('Interstellar', 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity''s survival.', 'movie', '{"Adventure", "Drama", "Sci-Fi"}', 2014, 169, 8.6, '/placeholder.svg?height=600&width=400', '/placeholder.svg?height=1080&width=1920'),
('Friends', 'Follows the personal and professional lives of six twenty to thirty-something friends living in Manhattan.', 'tv_show', '{"Comedy", "Romance"}', 1994, 22, 8.9, '/placeholder.svg?height=600&width=400', '/placeholder.svg?height=1080&width=1920'),
('Avengers: Endgame', 'The Avengers assemble once more to reverse Thanos'' actions and restore balance to the universe.', 'movie', '{"Action", "Adventure", "Drama"}', 2019, 181, 8.4, '/placeholder.svg?height=600&width=400', '/placeholder.svg?height=1080&width=1920'),
('The Crown', 'Follows the political rivalries and romance of Queen Elizabeth II''s reign and the events that shaped the second half of the twentieth century.', 'tv_show', '{"Biography", "Drama", "History"}', 2016, 58, 8.7, '/placeholder.svg?height=600&width=400', '/placeholder.svg?height=1080&width=1920'),
('Parasite', 'A poor family schemes to become employed by a wealthy family and infiltrate their household.', 'movie', '{"Comedy", "Drama", "Thriller"}', 2019, 132, 8.6, '/placeholder.svg?height=600&width=400', '/placeholder.svg?height=1080&width=1920'),
('Wednesday', 'Follows Wednesday Addams'' years as a student at Nevermore Academy.', 'tv_show', '{"Comedy", "Crime", "Family"}', 2022, 51, 8.1, '/placeholder.svg?height=600&width=400', '/placeholder.svg?height=1080&width=1920'),
('Top Gun: Maverick', 'After thirty years, Maverick is still pushing the envelope as a top naval aviator.', 'movie', '{"Action", "Drama"}', 2022, 130, 8.3, '/placeholder.svg?height=600&width=400', '/placeholder.svg?height=1080&width=1920'),
('Ozark', 'A financial advisor drags his family from Chicago to the Missouri Ozarks, where he must launder money to appease a drug boss.', 'tv_show', '{"Crime", "Drama", "Thriller"}', 2017, 60, 8.4, '/placeholder.svg?height=600&width=400', '/placeholder.svg?height=1080&width=1920'),
('Black Mirror', 'An anthology series exploring a twisted, high-tech multiverse where humanity''s greatest innovations and darkest instincts collide.', 'tv_show', '{"Drama", "Sci-Fi", "Thriller"}', 2011, 60, 8.8, '/placeholder.svg?height=600&width=400', '/placeholder.svg?height=1080&width=1920'),
('Dune', 'Paul Atreides leads nomadic tribes in a revolt against the galactic emperor and his father''s evil nemesis.', 'movie', '{"Action", "Adventure", "Drama"}', 2021, 155, 8.0, '/placeholder.svg?height=600&width=400', '/placeholder.svg?height=1080&width=1920'),
('The Witcher', 'Geralt of Rivia, a solitary monster hunter, struggles to find his place in a world where people often prove more wicked than beasts.', 'tv_show', '{"Action", "Adventure", "Drama"}', 2019, 60, 8.2, '/placeholder.svg?height=600&width=400', '/placeholder.svg?height=1080&width=1920'),
('Spider-Man: No Way Home', 'With Spider-Man''s identity now revealed, Peter asks Doctor Strange for help.', 'movie', '{"Action", "Adventure", "Fantasy"}', 2021, 148, 8.2, '/placeholder.svg?height=600&width=400', '/placeholder.svg?height=1080&width=1920');

-- Insert sample content metrics for the past 30 days
INSERT INTO public.content_metrics (content_id, date, view_count, unique_viewers, total_watch_time_seconds, average_completion_rate, rating_average, rating_count)
SELECT 
  id,
  CURRENT_DATE - INTERVAL '1 day' * generate_series(0, 29),
  (random() * 5000 + 100)::int,
  (random() * 3000 + 50)::int,
  (random() * 500000 + 10000)::bigint,
  (random() * 30 + 65)::decimal(5,2),
  (random() * 2 + 7.5)::decimal(3,1),
  (random() * 500 + 10)::int
FROM public.content
CROSS JOIN generate_series(0, 29);
