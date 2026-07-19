import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateBranchDto {
  @Transform(({ value }: { value: unknown }) => trimString(value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name!: string;

  @Transform(({ value }: { value: unknown }) => normalizeCode(value))
  @IsString()
  @MaxLength(32)
  @Matches(/^[A-Z0-9]+(?:-[A-Z0-9]+)*$/, {
    message: 'code must use letters, numbers, and single hyphens',
  })
  code!: string;

  @Transform(({ value }: { value: unknown }) => nullableTrimmedString(value))
  @IsOptional()
  @IsString()
  @MaxLength(500)
  address?: string | null;
}

function trimString(value: unknown): unknown {
  return typeof value === 'string' ? value.trim() : value;
}

function normalizeCode(value: unknown): unknown {
  return typeof value === 'string' ? value.trim().toUpperCase() : value;
}

function nullableTrimmedString(value: unknown): unknown {
  const trimmed = trimString(value);
  return trimmed === '' ? null : trimmed;
}
