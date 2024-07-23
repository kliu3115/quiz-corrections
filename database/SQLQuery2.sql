USE [QuizCorrections]
GO

/****** Object:  Table [dbo].[FLASHCARDDETAILS]    Script Date: 7/10/2024 4:39:07 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[FLASHCARDDETAILS]') AND type in (N'U'))
DROP TABLE [dbo].[FLASHCARDDETAILS]
GO

/****** Object:  Table [dbo].[FLASHCARDDETAILS]    Script Date: 7/10/2024 4:39:07 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[FLASHCARDDETAILS](
	[setID] [int] NOT NULL,
	[qID] [int] NOT NULL,
	[question] [text] NOT NULL,
	[answer] [text] NULL,
	[reason] [text] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO


