-- ============================================================
-- Script de seed: dados realistas para demo
-- Espaços com imagens, usuários com roles como ElementCollection
-- ============================================================

-- Ensure client uses UTF-8 and safe string handling when loading
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

-- Limpar dados existentes (cuidado: apaga tudo!)
DELETE FROM reservations;
DELETE FROM space_amenities;
DELETE FROM user_roles;
DELETE FROM spaces;
DELETE FROM users;

-- ============================================================
-- Usuários (Admin + Demo Users)
-- ElementCollection: roles são armazenadas na tabela user_roles automaticamente
-- Senha padrão para todos: admin123 (hash: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj.G6)
-- ============================================================

-- Do not insert the admin user here. The application will create a default admin
-- on startup using the PasswordEncoder to ensure the password is encoded
-- correctly (see AdminDataInitializer). Insert only demo users below.
INSERT INTO users (id, name, email, phone, password) VALUES
(2, 'João Silva', 'joao.silva@example.com', '(11) 99999-0001', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj.G6'),
(3, 'Maria Santos', 'maria.santos@example.com', '(11) 99999-0002', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj.G6');

-- Roles (bulk insert)
-- Roles for demo users (admin user's roles will be created by the initializer)
INSERT INTO user_roles (user_id, roles) VALUES
(2, 'ROLE_USER'),
(3, 'ROLE_USER');


-- ============================================================
-- Espaços (com imagens reais/placeholder) - bulk insert otimizado
-- ============================================================

INSERT INTO spaces (id, name, description, type, capacity, price_per_hour, image_url, available, floor, location, created_at) VALUES
(100, 'Sala de Reunião Premium', 
 'Sala moderna com projetor 4K, whiteboard interativo, climatização e wifi de alta velocidade.',
 'MEETING_ROOM', 12, 150.00, 
 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
 TRUE, '3', 'Bloco A', NOW()),
(101, 'Auditório Grande', 
 'Auditório com capacidade para 100 pessoas, sistema de som profissional e palco com iluminação.',
 'AUDITORIUM', 100, 500.00,
 'https://tse3.mm.bing.net/th/id/OIP.GGNa3nmmlG2Jfzm-KvQHEwHaE9?rs=1&pid=ImgDetMain&o=7&rm=3?w=400&h=300&fit=crop',
 TRUE, '2', 'Bloco B', NOW()),
(102, 'Espaço Coworking Aberto', 
 'Espaço flexível com 30 mesas, internet fibra, café grátis e ambiente colaborativo.',
 'COWORKING', 30, 80.00,
 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
 TRUE, '1', 'Bloco A', NOW()),
(103, 'Sala de Treinamento', 
 'Sala com 40 lugares, computadores, projetor e lousa digital para treinamentos.',
 'TRAINING_ROOM', 40, 200.00,
 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
 TRUE, '4', 'Bloco C', NOW()),
(104, 'Estúdio Podcast Profissional', 
 'Estúdio com isolamento acústico, microfones premium, console de som e espaço para 4 participantes.',
 'STUDIO', 4, 250.00,
 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=300&fit=crop',
 TRUE, '5', 'Bloco D', NOW()),
(105, 'Sala de Eventos Premium', 
 'Espaço elegante com capacidade para 80 pessoas, catering disponível, iluminação ambiente.',
 'EVENT_SPACE', 80, 400.00,
 'https://www.galeriadaarquitetura.com.br/Img/projeto/SF1/570/auditoriogeraldaufpa4414.jpg',
 TRUE, '3', 'Bloco B', NOW()),
(106, 'Sala de Foco Individual', 
 'Cabine privada para foco em trabalho individual com mesa, cadeira ergonômica e tomadas.',
 'FOCUS_ROOM', 1, 30.00,
 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=400&h=300&fit=crop',
 TRUE, '1', 'Bloco A', NOW());

-- ============================================================
-- Amenidades para os espaços (bulk insert otimizado)
-- ============================================================

INSERT INTO space_amenities (space_id, amenity) VALUES 
-- Sala Premium (100)
(100, 'Projetor 4K'), (100, 'Whiteboard'), (100, 'WiFi'), (100, 'Ar condicionado'), (100, 'Água e café'),
-- Auditório (101)
(101, 'Som profissional'), (101, 'Palco com iluminação'), (101, 'Ar condicionado'), (101, 'Assentos confortáveis'), (101, 'WiFi'),
-- Coworking (102)
(102, 'WiFi fibra'), (102, 'Café grátis'), (102, 'Tomadas múltiplas'), (102, 'Comunidade'),
-- Treinamento (103)
(103, 'Computadores'), (103, 'Projetor'), (103, 'Lousa digital'), (103, 'WiFi'), (103, 'Cadeiras ergonômicas'),
-- Estúdio Podcast (104)
(104, 'Microfones premium'), (104, 'Console de som'), (104, 'Isolamento acústico'), (104, 'Câmera para streaming'),
-- Sala Eventos (105)
(105, 'Catering'), (105, 'Iluminação ambiente'), (105, 'Som e projeção'), (105, 'WiFi'),
-- Sala Foco (106)
(106, 'Silencioso'), (106, 'WiFi'), (106, 'Ergonômico');

-- ============================================================
-- Reservas de exemplo (próximas semanas) - bulk insert otimizado
-- ============================================================

INSERT INTO reservations (id, space_id, user_name, user_email, user_phone, start_time, end_time, status, total_price, notes, created_at) VALUES
-- Reserva 1: João - Sala Premium (amanhã 9-11h)
(1000, 100, 'João Silva', 'joao.silva@example.com', '(11) 99999-0001',
 CURRENT_TIMESTAMP + INTERVAL '1 day' + INTERVAL '9 hours',
 CURRENT_TIMESTAMP + INTERVAL '1 day' + INTERVAL '11 hours',
 'CONFIRMED', 300.00, 'Reunião de planejamento estratégico', NOW()),
-- Reserva 2: Maria - Auditório (próxima segunda 14-18h)
(1001, 101, 'Maria Santos', 'maria.santos@example.com', '(11) 99999-0002',
 CURRENT_TIMESTAMP + INTERVAL '3 days' + INTERVAL '14 hours',
 CURRENT_TIMESTAMP + INTERVAL '3 days' + INTERVAL '18 hours',
 'CONFIRMED', 2000.00, 'Conferência com 80 pessoas', NOW()),
-- Reserva 3: Admin - Coworking (hoje 13-17h)
(1002, 102, 'Administrator', 'admin@example.com', '(11) 3000-0000',
 CURRENT_TIMESTAMP + INTERVAL '13 hours',
 CURRENT_TIMESTAMP + INTERVAL '17 hours',
 'CONFIRMED', 320.00, 'Trabalho remoto com cliente', NOW()),
-- Reserva 4: João - Estúdio Podcast (semana que vem quinta 10-12h)
(1003, 104, 'João Silva', 'joao.silva@example.com', '(11) 99999-0001',
 CURRENT_TIMESTAMP + INTERVAL '4 days' + INTERVAL '10 hours',
 CURRENT_TIMESTAMP + INTERVAL '4 days' + INTERVAL '12 hours',
 'PENDING', 500.00, 'Gravação de episódio do podcast', NOW()),
-- Reserva 5: Maria - Treinamento (próxima semana segunda-quarta 9-12h)
(1004, 103, 'Maria Santos', 'maria.santos@example.com', '(11) 99999-0002',
 CURRENT_TIMESTAMP + INTERVAL '8 days' + INTERVAL '9 hours',
 CURRENT_TIMESTAMP + INTERVAL '10 days' + INTERVAL '12 hours',
 'CONFIRMED', 1800.00, 'Treinamento de 3 dias - 40 participantes', NOW());

-- ============================================================
-- Resetar sequências (importante para PostgreSQL)
-- ============================================================

SELECT setval('users_id_seq', (SELECT MAX(id) FROM users) + 1);
SELECT setval('spaces_id_seq', (SELECT MAX(id) FROM spaces) + 1);
SELECT setval('reservations_id_seq', (SELECT MAX(id) FROM reservations) + 1);
