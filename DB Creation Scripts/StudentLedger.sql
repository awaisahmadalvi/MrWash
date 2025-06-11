SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[StudentLedger]
(
    [SLID] [int] IDENTITY(1,1) NOT NULL,
    [UserId] [int] NOT NULL,
    [ModeofPayment] [varchar](50) NOT NULL,
    [Deposit] [decimal](10, 2) NOT NULL,
    [Withdraw] [decimal](10, 2) NOT NULL,
    [Description] [varchar](255) NOT NULL,
    [MachineId] [int] NOT NULL,
    [isDeleted] [int] NOT NULL,
    [isDeletedDate] [date] NULL,
    [transactionDate] [datetime] NULL,
    [entryDate] [datetime] NULL,
    [otherInfo] [varchar](255) NULL,
    PRIMARY KEY CLUSTERED 
(
	[SLID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[StudentLedger] ADD  CONSTRAINT [DF_StudentLedger_isDeleted]  DEFAULT ((0)) FOR [isDeleted]
GO
ALTER TABLE [dbo].[StudentLedger]  WITH CHECK ADD FOREIGN KEY([UserId])
REFERENCES [dbo].[LaundryUser] ([UserID])
GO
ALTER TABLE [dbo].[StudentLedger]  WITH CHECK ADD  CONSTRAINT [StudentLedger_Machine_ID_FK] FOREIGN KEY([MachineId])
REFERENCES [dbo].[LaundryMachines] ([MachineID])
GO
ALTER TABLE [dbo].[StudentLedger] CHECK CONSTRAINT [StudentLedger_Machine_ID_FK]
GO
