-- ============================================================
-- Script de seed: dados realistas para demo
-- Espaços com imagens, usuários com roles como ElementCollection
-- ============================================================

-- Limpar dados existentes (cuidado: apaga tudo!)
DELETE FROM reservations;
DELETE FROM space_amenities;
DELETE FROM user_roles;
DELETE FROM spaces;
DELETE FROM users;

-- ============================================================
-- Usuários (Admin + Demo Users)
-- ElementCollection: roles são armazenadas na tabela user_roles automaticamente
-- ============================================================

-- Admin (senha: admin123)
INSERT INTO users (id, name, email, phone, password)
VALUES (1, 'Administrator', 'admin@example.com', '(11) 3000-0000', 
        '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj.G6');

-- Usuário demo 1
INSERT INTO users (id, name, email, phone, password)
VALUES (2, 'João Silva', 'joao.silva@example.com', '(11) 99999-0001',
        '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj.G6');

-- Usuário demo 2
INSERT INTO users (id, name, email, phone, password)
VALUES (3, 'Maria Santos', 'maria.santos@example.com', '(11) 99999-0002',
        '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRj.G6');

-- Roles para admin (tabela user_roles com coluna 'roles')
INSERT INTO user_roles (user_id, roles) VALUES (1, 'ROLE_USER');
INSERT INTO user_roles (user_id, roles) VALUES (1, 'ROLE_ADMIN');

-- Roles para demo users
INSERT INTO user_roles (user_id, roles) VALUES (2, 'ROLE_USER');
INSERT INTO user_roles (user_id, roles) VALUES (3, 'ROLE_USER');


-- ============================================================
-- Espaços (com imagens reais/placeholder)
-- ============================================================

-- Sala de Reunião Premium
INSERT INTO spaces (id, name, description, type, capacity, price_per_hour, image_url, available, floor, location, created_at)
VALUES (100, 'Sala de Reunião Premium', 
        'Sala moderna com projetor 4K, whiteboard interativo, climatização e wifi de alta velocidade.',
        'MEETING_ROOM', 12, 150.00, 
        'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
        TRUE, '3', 'Bloco A', NOW());

-- Auditório Grande
INSERT INTO spaces (id, name, description, type, capacity, price_per_hour, image_url, available, floor, location, created_at)
VALUES (101, 'Auditório Grande', 
        'Auditório com capacidade para 100 pessoas, sistema de som profissional e palco com iluminação.',
        'AUDITORIUM', 100, 500.00,
        'https://images.unsplash.com/photo-1519671482677-e37ab6f4c51f?w=400&h=300&fit=crop',
        TRUE, '2', 'Bloco B', NOW());

-- Espaço Coworking
INSERT INTO spaces (id, name, description, type, capacity, price_per_hour, image_url, available, floor, location, created_at)
VALUES (102, 'Espaço Coworking Aberto', 
        'Espaço flexível com 30 mesas, internet fibra, café grátis e ambiente colaborativo.',
        'COWORKING', 30, 80.00,
        'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
        TRUE, '1', 'Bloco A', NOW());

-- Sala de Treinamento
INSERT INTO spaces (id, name, description, type, capacity, price_per_hour, image_url, available, floor, location, created_at)
VALUES (103, 'Sala de Treinamento', 
        'Sala com 40 lugares, computadores, projetor e lousa digital para treinamentos.',
        'TRAINING_ROOM', 40, 200.00,
        'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
        TRUE, '4', 'Bloco C', NOW());

-- Estúdio Podcast
INSERT INTO spaces (id, name, description, type, capacity, price_per_hour, image_url, available, floor, location, created_at)
VALUES (104, 'Estúdio Podcast Profissional', 
        'Estúdio com isolamento acústico, microfones premium, console de som e espaço para 4 participantes.',
        'STUDIO', 4, 250.00,
        'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=300&fit=crop',
        TRUE, '5', 'Bloco D', NOW());

-- Sala de Eventos
INSERT INTO spaces (id, name, description, type, capacity, price_per_hour, image_url, available, floor, location, created_at)
VALUES (105, 'Sala de Eventos Premium', 
        'Espaço elegante com capacidade para 80 pessoas, catering disponível, iluminação ambiente.',
        'EVENT_SPACE', 80, 400.00,
        'https://images.unsplash.com/photo-1519671482677-e37ab6f4c51f?w=400&h=300&fit=crop',
        TRUE, '3', 'Bloco B', NOW());

-- Sala de Foco
INSERT INTO spaces (id, name, description, type, capacity, price_per_hour, image_url, available, floor, location, created_at)
VALUES (106, 'Sala de Foco Individual', 
        'Cabine privada para foco em trabalho individual com mesa, cadeira ergonômica e tomadas.',
        'FOCUS_ROOM', 1, 30.00,
        'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=400&h=300&fit=crop',
        TRUE, '1', 'Bloco A', NOW());

-- ============================================================
-- Amenidades para os espaços (space_amenities usa coluna 'amenity', não 'amenities')
-- ============================================================

-- Sala Premium: amenidades
INSERT INTO space_amenities (space_id, amenity) VALUES (100, 'Projetor 4K');
INSERT INTO space_amenities (space_id, amenity) VALUES (100, 'Whiteboard');
INSERT INTO space_amenities (space_id, amenity) VALUES (100, 'WiFi');
INSERT INTO space_amenities (space_id, amenity) VALUES (100, 'Ar condicionado');
INSERT INTO space_amenities (space_id, amenity) VALUES (100, 'Água e café');

-- Auditório: amenidades
INSERT INTO space_amenities (space_id, amenity) VALUES (101, 'Som profissional');
INSERT INTO space_amenities (space_id, amenity) VALUES (101, 'Palco com iluminação');
INSERT INTO space_amenities (space_id, amenity) VALUES (101, 'Ar condicionado');
INSERT INTO space_amenities (space_id, amenity) VALUES (101, 'Assentos confortáveis');
INSERT INTO space_amenities (space_id, amenity) VALUES (101, 'WiFi');

-- Coworking: amenidades
INSERT INTO space_amenities (space_id, amenity) VALUES (102, 'WiFi fibra');
INSERT INTO space_amenities (space_id, amenity) VALUES (102, 'Café grátis');
INSERT INTO space_amenities (space_id, amenity) VALUES (102, 'Tomadas múltiplas');
INSERT INTO space_amenities (space_id, amenity) VALUES (102, 'Comunidade');

-- Treinamento: amenidades
INSERT INTO space_amenities (space_id, amenity) VALUES (103, 'Computadores');
INSERT INTO space_amenities (space_id, amenity) VALUES (103, 'Projetor');
INSERT INTO space_amenities (space_id, amenity) VALUES (103, 'Lousa digital');
INSERT INTO space_amenities (space_id, amenity) VALUES (103, 'WiFi');
INSERT INTO space_amenities (space_id, amenity) VALUES (103, 'Cadeiras ergonômicas');

-- Estúdio Podcast: amenidades
INSERT INTO space_amenities (space_id, amenity) VALUES (104, 'Microfones premium');
INSERT INTO space_amenities (space_id, amenity) VALUES (104, 'Console de som');
INSERT INTO space_amenities (space_id, amenity) VALUES (104, 'Isolamento acústico');
INSERT INTO space_amenities (space_id, amenity) VALUES (104, 'Câmera para streaming');

-- Sala Eventos: amenidades
INSERT INTO space_amenities (space_id, amenity) VALUES (105, 'Catering');
INSERT INTO space_amenities (space_id, amenity) VALUES (105, 'Iluminação ambiente');
INSERT INTO space_amenities (space_id, amenity) VALUES (105, 'Som e projeção');
INSERT INTO space_amenities (space_id, amenity) VALUES (105, 'WiFi');

-- Sala Foco: amenidades
INSERT INTO space_amenities (space_id, amenity) VALUES (106, 'Silencioso');
INSERT INTO space_amenities (space_id, amenity) VALUES (106, 'WiFi');
INSERT INTO space_amenities (space_id, amenity) VALUES (106, 'Ergonômico');

-- ============================================================
-- Reservas de exemplo (próximas semanas)
-- ============================================================

-- Reserva 1: João - Sala Premium (amanhã 9-11h)
INSERT INTO reservations (id, space_id, user_name, user_email, user_phone, start_time, end_time, status, total_price, notes, created_at)
VALUES (1000, 100, 'João Silva', 'joao.silva@example.com', '(11) 99999-0001',
        CURRENT_TIMESTAMP + INTERVAL '1 day' + INTERVAL '9 hours',
        CURRENT_TIMESTAMP + INTERVAL '1 day' + INTERVAL '11 hours',
        'CONFIRMED', 300.00, 'Reunião de planejamento estratégico', NOW());

-- Reserva 2: Maria - Auditório (próxima segunda 14-18h)
INSERT INTO reservations (id, space_id, user_name, user_email, user_phone, start_time, end_time, status, total_price, notes, created_at)
VALUES (1001, 101, 'Maria Santos', 'maria.santos@example.com', '(11) 99999-0002',
        CURRENT_TIMESTAMP + INTERVAL '3 days' + INTERVAL '14 hours',
        CURRENT_TIMESTAMP + INTERVAL '3 days' + INTERVAL '18 hours',
        'CONFIRMED', 2000.00, 'Conferência com 80 pessoas', NOW());

-- Reserva 3: Admin - Coworking (hoje 13-17h)
INSERT INTO reservations (id, space_id, user_name, user_email, user_phone, start_time, end_time, status, total_price, notes, created_at)
VALUES (1002, 102, 'Administrator', 'admin@example.com', '(11) 3000-0000',
        CURRENT_TIMESTAMP + INTERVAL '13 hours',
        CURRENT_TIMESTAMP + INTERVAL '17 hours',
        'CONFIRMED', 320.00, 'Trabalho remoto com cliente', NOW());

-- Reserva 4: João - Estúdio Podcast (semana que vem quinta 10-12h)
INSERT INTO reservations (id, space_id, user_name, user_email, user_phone, start_time, end_time, status, total_price, notes, created_at)
VALUES (1003, 104, 'João Silva', 'joao.silva@example.com', '(11) 99999-0001',
        CURRENT_TIMESTAMP + INTERVAL '4 days' + INTERVAL '10 hours',
        CURRENT_TIMESTAMP + INTERVAL '4 days' + INTERVAL '12 hours',
        'PENDING', 500.00, 'Gravação de episódio do podcast', NOW());

-- Reserva 5: Maria - Treinamento (próxima semana segunda-quarta 9-12h)
INSERT INTO reservations (id, space_id, user_name, user_email, user_phone, start_time, end_time, status, total_price, notes, created_at)
VALUES (1004, 103, 'Maria Santos', 'maria.santos@example.com', '(11) 99999-0002',
        CURRENT_TIMESTAMP + INTERVAL '8 days' + INTERVAL '9 hours',
        CURRENT_TIMESTAMP + INTERVAL '10 days' + INTERVAL '12 hours',
        'CONFIRMED', 1800.00, 'Treinamento de 3 dias - 40 participantes', NOW());

-- ============================================================
-- Resetar sequências (importante para PostgreSQL)
-- ============================================================

SELECT setval('users_id_seq', (SELECT MAX(id) FROM users) + 1);
SELECT setval('spaces_id_seq', (SELECT MAX(id) FROM spaces) + 1);
SELECT setval('reservations_id_seq', (SELECT MAX(id) FROM reservations) + 1);
