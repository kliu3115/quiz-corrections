INSERT INTO USERS (username, password, firstName, lastName) VALUES ('pua1', 'carrot', 'pua', 'peeg')
INSERT INTO USERS (username, password, firstName, lastName) VALUES ('pua2', 'carrot2', 'pua2', 'peeg2')
INSERT INTO FLASHCARDSETS(setName, createdBy, createdDate) VALUES ('test set1: length 20', 'boop', CURRENT_TIMESTAMP)
INSERT INTO FLASHCARDSETS(setName, createdBy, createdDate) VALUES ('test set2', 'boop', CURRENT_TIMESTAMP)
INSERT INTO FLASHCARDSETS(setName, createdBy, createdDate) VALUES ('test set3', 'boop', CURRENT_TIMESTAMP)
INSERT INTO FLASHCARDSETS(setName, createdBy, createdDate) VALUES ('test set4', 'boop', CURRENT_TIMESTAMP)
INSERT INTO FLASHCARDDETAILS(setID, qID, question) VALUES (1, 1, 'who')
INSERT INTO FLASHCARDDETAILS(setID, qID, question) VALUES (1, 2, 'what')
INSERT INTO FLASHCARDDETAILS(setID, qID, question) VALUES (1, 3, 'when')
INSERT INTO FLASHCARDDETAILS(setID, qID, question) VALUES (1, 4, 'where')
INSERT INTO FLASHCARDDETAILS(setID, qID, question) VALUES (2, 1, 'how2')
INSERT INTO FLASHCARDDETAILS(setID, qID, question) VALUES (3, 1, 'how3')
INSERT INTO FLASHCARDDETAILS(setID, qID, question) VALUES (4, 1, 'how4')

UPDATE FLASHCARDDETAILS SET answer = 'idk', reason = 'idk' WHERE setID = 1 AND qID = 1;
UPDATE FLASHCARDDETAILS SET answer = 'idk' WHERE setID = 1 AND qID = 2;
UPDATE FLASHCARDDETAILS SET reason = 'idk' WHERE setID = 1 AND qID = 4;

SELECT * FROM USERS WHERE username='pua1' AND password='carrot' --for verifying login
SELECT * FROM FLASHCARDSETS
SELECT * FROM FLASHCARDDETAILS

