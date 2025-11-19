-- Dados iniciais para demo
INSERT INTO spaces (id, name, description, type, capacity, price_per_hour, available, floor, location, created_at)
VALUES
 (1, 'Sala de Reunião A', 'Ideal para 10 pessoas', 'MEETING_ROOM', 10, 50.00, TRUE, '2º andar', 'Ala Norte', CURRENT_TIMESTAMP),
 (2, 'Auditório Azul', 'Projetor + 100 lugares', 'AUDITORIUM', 100, 200.00, TRUE, 'Térreo', 'Bloco B', CURRENT_TIMESTAMP);

-- Reserva de exemplo (não conflita com outras)
-- Ajuste as datas conforme o fuso horário/local
INSERT INTO reservations (id, space_id, user_name, user_email, user_phone, start_time, end_time, status, total_price, notes, created_at)
VALUES
 (1, 1, 'João Silva', 'joao@example.com', '11999990000', TIMESTAMP '2025-11-18 09:00:00', TIMESTAMP '2025-11-18 11:00:00', 'CONFIRMED', 100.00, 'Reunião mensal', CURRENT_TIMESTAMP);
