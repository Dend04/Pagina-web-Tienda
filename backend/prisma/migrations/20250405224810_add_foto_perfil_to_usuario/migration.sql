-- AlterTable
ALTER TABLE "Producto" ADD COLUMN     "carritoId" BIGINT;

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "fotoPerfil" TEXT;

-- CreateTable
CREATE TABLE "Carrito" (
    "id" BIGSERIAL NOT NULL,
    "usuarioId" BIGINT NOT NULL,
    "creadoEn" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Carrito_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarritoItem" (
    "id" BIGSERIAL NOT NULL,
    "carritoId" BIGINT NOT NULL,
    "productoId" BIGINT NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 1,
    "precioUnitario" DECIMAL(10,2) NOT NULL,
    "creadoEn" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CarritoItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Carrito_usuarioId_key" ON "Carrito"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "CarritoItem_carritoId_productoId_key" ON "CarritoItem"("carritoId", "productoId");

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_carritoId_fkey" FOREIGN KEY ("carritoId") REFERENCES "Carrito"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Carrito" ADD CONSTRAINT "Carrito_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarritoItem" ADD CONSTRAINT "CarritoItem_carritoId_fkey" FOREIGN KEY ("carritoId") REFERENCES "Carrito"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarritoItem" ADD CONSTRAINT "CarritoItem_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
