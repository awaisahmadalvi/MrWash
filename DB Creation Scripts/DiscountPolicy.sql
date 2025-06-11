SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DiscountPolicy]
(
    [DiscountPolicyId] [int] IDENTITY(1,1) NOT NULL,
    [MachineId] [int] NOT NULL,
    [DiscountPer] [decimal](5, 2) NOT NULL,
    [StartDate] [date] NOT NULL,
    [EndDate] [date] NOT NULL,
    [isDeleted] [int] NOT NULL,
    [isDeletedDate] [date] NULL,
    [otherInfo] [varchar](255) NULL,
    PRIMARY KEY CLUSTERED 
(
	[DiscountPolicyId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
    UNIQUE NONCLUSTERED 
(
	[MachineId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[DiscountPolicy] ADD  CONSTRAINT [DF_DiscountPolicy_isDeleted]  DEFAULT ((0)) FOR [isDeleted]
GO
ALTER TABLE [dbo].[DiscountPolicy]  WITH CHECK ADD  CONSTRAINT [FK_DiscountPolicy_LaundryMachine] FOREIGN KEY([MachineId])
REFERENCES [dbo].[LaundryMachines] ([MachineID])
GO
ALTER TABLE [dbo].[DiscountPolicy] CHECK CONSTRAINT [FK_DiscountPolicy_LaundryMachine]
GO
