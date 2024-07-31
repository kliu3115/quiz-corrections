USE [QuizCorrections]
GO

/****** Object:  Table [dbo].[FLASHCARDSETS]    Script Date: 7/14/2024 2:38:08 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[FLASHCARDSETS]') AND type in (N'U'))
DROP TABLE [dbo].[FLASHCARDSETS]
GO

/****** Object:  Table [dbo].[FLASHCARDSETS]    Script Date: 7/14/2024 2:38:08 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[FLASHCARDSETS](
	[setName] [nvarchar](max) NOT NULL,
	[createdBy] [nvarchar](max) NOT NULL,
	[createdDate] [datetime] NOT NULL,
	[setID] [int] IDENTITY(1,1) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[setID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO


