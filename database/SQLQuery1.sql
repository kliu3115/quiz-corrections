USE [QuizCorrections]
GO

/****** Object:  Table [dbo].[FLASHCARDSETS]    Script Date: 7/10/2024 4:37:12 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[FLASHCARDSETS]') AND type in (N'U'))
DROP TABLE [dbo].[FLASHCARDSETS]
GO

/****** Object:  Table [dbo].[FLASHCARDSETS]    Script Date: 7/10/2024 4:37:12 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[FLASHCARDSETS](
	[setName] [nvarchar](20) NOT NULL,
	[createdBy] [nvarchar](20) NOT NULL,
	[createdDate] [datetime] NOT NULL,
	[setID] [int] identity(1,1) primary key NOT NULL
) ON [PRIMARY]
GO


