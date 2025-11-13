-- =====================================================
-- INSERT PLAYERS
-- =====================================================
INSERT INTO player (name, created_at, is_active) VALUES
('Luke', '2024-12-05 14:44:53.046', TRUE),
('Jake', '2024-12-05 14:44:53.046', TRUE),
('Claire', '2024-12-05 14:44:53.046', TRUE),
('Trent', '2024-12-05 14:44:53.046', TRUE),
('Lynn', '2024-12-05 14:44:53.046', TRUE),
('Alex D', '2024-12-05 14:44:53.046', TRUE),
('Ashley', '2024-12-05 14:44:53.046', TRUE),
('Brad', '2024-12-05 14:44:53.046', TRUE),
('Christy', '2024-12-05 14:44:53.046', TRUE),
('Karla', '2024-12-05 14:44:53.046', TRUE),
('Wade', '2024-12-05 14:44:53.046', TRUE),
('Scott', '2024-12-05 14:44:53.046', TRUE),
('Patrick', '2024-12-05 14:44:53.046', TRUE),
('Haley', '2024-12-05 14:44:53.046', TRUE),
('Alex P', '2024-12-05 14:44:53.046', TRUE),
('Erik', '2024-12-05 14:44:53.046', TRUE),
('Hayes', '2024-12-05 14:44:53.046', TRUE),
('Nash', '2024-12-05 14:44:53.046', TRUE),
('Charlie', '2024-12-05 14:44:53.046', TRUE),
('Sophia', '2024-12-06 16:15:51.898', TRUE),
('Margie', '2024-12-06 20:35:54.164', TRUE),
('Paulina', '2024-12-06 20:35:59.338', TRUE),
('Anthony', '2024-12-06 21:05:40.877', TRUE),
('Manny', '2024-12-06 21:05:45.563', TRUE),
('Andrew', CURRENT_TIMESTAMP, TRUE);

-- =====================================================
-- INSERT GAMES
-- =====================================================
INSERT INTO game (date, location, message, created_at) VALUES
('2024-11-24', 'Laramie, WY', '(Jake unzips hoodie and reveals Christmas shirt) "Who''s ready to take pictures?!"', '2024-12-06 16:26:59.782'),
('2024-11-28', 'Yorkville, IL', 'Dominant', '2024-12-06 20:34:41.187'),
('2024-11-28', 'Yorkville, IL', '117, 118, 119 !!', '2024-12-06 20:35:32.169'),
('2024-11-29', 'Yorkville, IL', 'group photo', '2024-12-06 20:36:43.78'),
('2024-11-29', 'Yorkville, IL', 'Claire w the comeback', '2024-12-06 21:04:36.231'),
('2024-12-01', 'Yorkville, IL', 'Who let Boule win?', '2024-12-06 21:06:56.702'),
('2024-12-01', 'Yorkville, IL', 'revenge game', '2024-12-06 21:08:09.617'),
('2024-12-16', 'Yorkville, IL', 'Dang who let Dad win', '2024-12-17 03:28:37.076'),
('2024-12-24', 'Cocoa Beach, FL', '130!', '2024-12-24 01:59:31.951'),
('2024-12-24', 'Cocoa Beach, FL', 'Very close!', '2024-12-24 02:58:10.586'),
('2024-12-24', 'Cocoa Beach, FL', '129, 128, 127', '2024-12-24 03:59:28.178'),
('2024-12-26', 'Cocoa Beach, FL', '10 people! Claire perfect!', '2024-12-26 01:50:05.651'),
('2024-12-26', 'Cocoa Beach, FL', 'Close!', '2024-12-26 02:27:27.709'),
('2024-12-26', 'Cocoa Beach, FL', 'Claire wins again! 10 runs', '2024-12-26 03:06:45.549'),
('2024-12-26', 'Cocoa Beach, FL', '3 way tie?!', '2024-12-26 03:54:15.847'),
('2024-12-26', 'Cocoa Beach, FL', NULL, '2024-12-27 01:42:08.613'),
('2024-12-26', 'Cocoa Beach, FL', 'What is this show?', '2024-12-27 02:35:59.968'),
('2024-12-27', 'Cocoa Beach, FL', 'JD!', '2024-12-28 01:20:09.464'),
('2024-12-27', 'Cocoa Beach, FL', 'Go Mom', '2024-12-28 02:13:55.896'),
('2024-12-28', 'Cocoa Beach, FL', 'Almost!', '2024-12-29 02:35:52.989'),
('2024-12-31', 'Cocoa Beach, FL', 'Close', '2025-01-03 15:08:11.475'),
('2025-03-15', 'Yorkville, IL', 'Go Mom!', '2025-03-18 01:59:03.223'),
('2025-03-15', 'Yorkville, IL', 'Who''s surprised', '2025-03-18 02:00:12.662'),
('2025-05-26', 'Mukwanago, WI', 'Dominant', '2025-05-26 01:57:18.988'),
('2025-10-25', 'Laramie, WY', 'Close', '2025-10-28 17:41:24.664');

-- =====================================================
-- INSERT PLAYER_SCORES
-- =====================================================
-- Game 1: 2024-11-24 Laramie
INSERT INTO player_score (player_id, game_id, score) VALUES
(4, 1, 109),   -- Trent
(14, 1, 105),  -- Haley
(2, 1, 94),    -- Jake
(20, 1, 115),  -- Sophia
(1, 1, 126),   -- Luke
(3, 1, 123);   -- Claire

-- Game 2: 2024-11-28 Yorkville - "Dominant"
INSERT INTO player_score (player_id, game_id, score) VALUES
(3, 2, 144),   -- Claire
(1, 2, 87),    -- Luke
(4, 2, 119);   -- Trent

-- Game 3: 2024-11-28 Yorkville - "117, 118, 119 !!"
INSERT INTO player_score (player_id, game_id, score) VALUES
(1, 3, 119),   -- Luke
(3, 3, 118),   -- Claire
(4, 3, 117);   -- Trent

-- Game 4: 2024-11-29 Yorkville - "group photo"
INSERT INTO player_score (player_id, game_id, score) VALUES
(4, 4, 160),   -- Trent
(1, 4, 157),   -- Luke
(21, 4, 105),  -- Margie
(22, 4, 119),  -- Paulina
(3, 4, 129);   -- Claire

-- Game 5: 2024-11-29 Yorkville - "Claire w the comeback"
INSERT INTO player_score (player_id, game_id, score) VALUES
(1, 5, 150),   -- Luke
(3, 5, 152),   -- Claire
(4, 5, 138);   -- Trent

-- Game 6: 2024-12-01 Yorkville - "Who let Boule win?"
INSERT INTO player_score (player_id, game_id, score) VALUES
(23, 6, 165),  -- Anthony
(24, 6, 96),   -- Manny
(1, 6, 134),   -- Luke
(3, 6, 159),   -- Claire
(4, 6, 148);   -- Trent

-- Game 7: 2024-12-01 Yorkville - "revenge game"
INSERT INTO player_score (player_id, game_id, score) VALUES
(1, 7, 164),   -- Luke
(4, 7, 153),   -- Trent
(3, 7, 103),   -- Claire
(23, 7, 137);  -- Anthony

-- Game 8: 2024-12-16 Yorkville - "Dang who let Dad win"
INSERT INTO player_score (player_id, game_id, score) VALUES
(4, 8, 160),   -- Trent
(5, 8, 158),   -- Lynn
(3, 8, 147),   -- Claire
(2, 8, 123),   -- Jake
(1, 8, 122);   -- Luke

-- Game 9: 2024-12-24 Cocoa Beach - "130!"
INSERT INTO player_score (player_id, game_id, score) VALUES
(7, 9, 114),   -- Ashley
(1, 9, 111),   -- Luke
(8, 9, 106),   -- Brad
(4, 9, 106),   -- Trent
(3, 9, 96),    -- Claire
(9, 9, 104),   -- Christy
(6, 9, 103);   -- Alex D

-- Game 10: 2024-12-24 Cocoa Beach - "Very close!"
INSERT INTO player_score (player_id, game_id, score) VALUES
(9, 10, 129),  -- Christy
(6, 10, 128),  -- Alex D
(8, 10, 127),  -- Brad
(4, 10, 118),  -- Trent
(1, 10, 107),  -- Luke
(7, 10, 103),  -- Ashley
(3, 10, 97);   -- Claire

-- Game 11: 2024-12-24 Cocoa Beach - "129, 128, 127"
INSERT INTO player_score (player_id, game_id, score) VALUES
(8, 11, 55),   -- Brad
(7, 11, 99),   -- Ashley
(1, 11, 114),  -- Luke
(9, 11, 118),  -- Christy
(4, 11, 115),  -- Trent
(3, 11, 130),  -- Claire
(6, 11, 100);  -- Alex D

-- Game 12: 2024-12-26 Cocoa Beach - "10 people! Claire perfect!"
INSERT INTO player_score (player_id, game_id, score) VALUES
(2, 12, 85),   -- Jake
(1, 12, 85),   -- Luke
(6, 12, 95),   -- Alex D
(3, 12, 103),  -- Claire
(5, 12, 71),   -- Lynn
(20, 12, 80),  -- Sophia
(7, 12, 82),   -- Ashley
(9, 12, 61),   -- Christy
(8, 12, 74),   -- Brad
(4, 12, 93);   -- Trent

-- Game 13: 2024-12-26 Cocoa Beach - "Close!"
INSERT INTO player_score (player_id, game_id, score) VALUES
(1, 13, 72),   -- Luke
(6, 13, 87),   -- Alex D
(3, 13, 83),   -- Claire
(5, 13, 73),   -- Lynn
(20, 13, 74),  -- Sophia
(7, 13, 82),   -- Ashley
(9, 13, 91),   -- Christy
(8, 13, 80),   -- Brad
(4, 13, 86),   -- Trent
(2, 13, 73);   -- Jake

-- Game 14: 2024-12-26 Cocoa Beach - "Claire wins again! 10 runs"
INSERT INTO player_score (player_id, game_id, score) VALUES
(8, 14, 101),  -- Brad
(4, 14, 77),   -- Trent
(2, 14, 72),   -- Jake
(1, 14, 94),   -- Luke
(6, 14, 93),   -- Alex D
(3, 14, 104),  -- Claire
(5, 14, 81),   -- Lynn
(20, 14, 70),  -- Sophia
(7, 14, 64),   -- Ashley
(9, 14, 93);   -- Christy

-- Game 15: 2024-12-26 Cocoa Beach - "3 way tie?!"
INSERT INTO player_score (player_id, game_id, score) VALUES
(7, 15, 74),   -- Ashley
(9, 15, 91),   -- Christy
(8, 15, 102),  -- Brad
(4, 15, 102),  -- Trent
(2, 15, 74),   -- Jake
(1, 15, 92),   -- Luke
(6, 15, 72),   -- Alex D
(3, 15, 102),  -- Claire
(5, 15, 82),   -- Lynn
(20, 15, 80);  -- Sophia

-- Game 16: 2024-12-26 Cocoa Beach - (no message)
INSERT INTO player_score (player_id, game_id, score) VALUES
(7, 16, 82),   -- Ashley
(8, 16, 75),   -- Brad
(4, 16, 87),   -- Trent
(6, 16, 77),   -- Alex D
(2, 16, 85),   -- Jake
(3, 16, 92),   -- Claire
(1, 16, 104),  -- Luke
(20, 16, 93);  -- Sophia

-- Game 17: 2024-12-26 Cocoa Beach - "What is this show?"
INSERT INTO player_score (player_id, game_id, score) VALUES
(4, 17, 102),  -- Trent
(2, 17, 110),  -- Jake
(3, 17, 124),  -- Claire
(7, 17, 129),  -- Ashley
(1, 17, 139),  -- Luke
(6, 17, 132);  -- Alex D

-- Game 18: 2024-12-27 Cocoa Beach - "JD!"
INSERT INTO player_score (player_id, game_id, score) VALUES
(20, 18, 93),  -- Sophia
(1, 18, 90),   -- Luke
(3, 18, 91),   -- Claire
(5, 18, 83),   -- Lynn
(4, 18, 112),  -- Trent
(2, 18, 115),  -- Jake
(14, 18, 63);  -- Haley

-- Game 19: 2024-12-27 Cocoa Beach - "Go Mom"
INSERT INTO player_score (player_id, game_id, score) VALUES
(20, 19, 87),  -- Sophia
(1, 19, 110),  -- Luke
(3, 19, 115),  -- Claire
(5, 19, 126),  -- Lynn
(4, 19, 115),  -- Trent
(2, 19, 106),  -- Jake
(14, 19, 119); -- Haley

-- Game 20: 2024-12-28 Cocoa Beach - "Almost!"
INSERT INTO player_score (player_id, game_id, score) VALUES
(1, 20, 91),   -- Luke
(20, 20, 104), -- Sophia
(14, 20, 120), -- Haley
(2, 20, 133),  -- Jake
(4, 20, 155),  -- Trent
(3, 20, 141);  -- Claire

-- Game 21: 2024-12-31 Cocoa Beach - "Close"
INSERT INTO player_score (player_id, game_id, score) VALUES
(2, 21, 134),  -- Jake
(4, 21, 151),  -- Trent
(20, 21, 147), -- Sophia
(14, 21, 119), -- Haley
(1, 21, 146);  -- Luke

-- Game 22: 2025-03-15 Yorkville - "Go Mom!"
INSERT INTO player_score (player_id, game_id, score) VALUES
(1, 22, 138),  -- Luke
(5, 22, 148),  -- Lynn
(4, 22, 128),  -- Trent
(2, 22, 93),   -- Jake
(3, 22, 108),  -- Claire
(20, 22, 98);  -- Sophia

-- Game 23: 2025-03-15 Yorkville - "Who's surprised"
INSERT INTO player_score (player_id, game_id, score) VALUES
(4, 23, 151),  -- Trent
(1, 23, 117),  -- Luke
(5, 23, 122),  -- Lynn
(2, 23, 143),  -- Jake
(3, 23, 115),  -- Claire
(20, 23, 132); -- Sophia

-- Game 24: 2025-05-26 Mukwanago - "Dominant"
INSERT INTO player_score (player_id, game_id, score) VALUES
(1, 24, 96),   -- Luke
(23, 24, 101), -- Anthony
(2, 24, 118),  -- Jake
(8, 24, 126),  -- Brad
(16, 24, 87),  -- Erik
(17, 24, 75),  -- Hayes
(4, 24, 86);   -- Trent

-- Game 25: 2025-10-25 Laramie - "Close"
INSERT INTO player_score (player_id, game_id, score) VALUES
(1, 25, 124),  -- Luke
(5, 25, 123),  -- Lynn
(4, 25, 107),  -- Trent
(2, 25, 114),  -- Jake
(9, 25, 88),   -- Christy
(8, 25, 84);   -- Brad