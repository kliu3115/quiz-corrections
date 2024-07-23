INSERT INTO USERS (username, password, firstName, lastName) VALUES ('pua1', 'carrot', 'pua', 'peeg')
INSERT INTO USERS (username, password, firstName, lastName) VALUES ('pua2', 'carrot2', 'pua2', 'peeg2')
INSERT INTO FLASHCARDSETS(setName, createdBy, createdDate) VALUES ('test set1: length 20', 'boop', CURRENT_TIMESTAMP)
INSERT INTO FLASHCARDSETS(setName, createdBy, createdDate) VALUES ('test set2', 'boop', CURRENT_TIMESTAMP)
INSERT INTO FLASHCARDSETS(setName, createdBy, createdDate) VALUES ('test set3', 'boop', CURRENT_TIMESTAMP)
INSERT INTO FLASHCARDSETS(setName, createdBy, createdDate) VALUES ('test set4', 'boop', CURRENT_TIMESTAMP)

SELECT * FROM USERS WHERE username='pua1' AND password='carrot' --for verifying login
SELECT * FROM FLASHCARDSETS
